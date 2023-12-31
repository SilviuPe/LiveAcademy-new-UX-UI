import React, { useState } from 'react';
import './coursecreator.css';
import './courseTitle.css';

import { Header, NewChapter } from '../../components';

import add from '../../assets/add.png';

import { errorsHandle } from './errorsHandling';
import { json } from 'react-router-dom';







const CourseCreator = () => {
    const [chartTitleOpen,setChartTitleOpen] = useState(false);
    const [courseStructure, setCourseStructure] = useState({
        CourseTitle : '',
        Author : sessionStorage.getItem('username'),
        Chapters : {

        },
        CourseID : ''
    });
    const [errors,setErrors] = useState({
        title: false
    });
    const errorsOptions = errorsHandle(errors);
    if (!sessionStorage.getItem('username')) window.location.href = '/login'; 
    // Update the title of the course
    function updateCourseTitle(title) {
        setCourseStructure(() => {
            let newStructure = {
                ...courseStructure,
                CourseTitle : title
            }
            return newStructure;
        })
    }

    // Add new chapter 
    function addNewChapter(title) {
        setChartTitleOpen(!chartTitleOpen)
        setCourseStructure(() => {
            let existing_chapters = courseStructure['Chapters'];
            let newCourseStructure = {
                ...courseStructure,
                Chapters: {
                    ...existing_chapters,
                    [title]: {
                        lectures : {

                        }
                    }
                }
            }
            return newCourseStructure;
        })
    }

    // Update an existing chapter 
    function updateChapter(chapterTitle, updatedTitle) {
        setCourseStructure(() => {

            let existing_chapters = Object.keys(courseStructure['Chapters']);
            let new_existing_chapters = {}
            
            let lectures = courseStructure['Chapters'][chapterTitle]['lectures'];
            existing_chapters.forEach((key) => {
                if(key == chapterTitle) {
                    new_existing_chapters[updatedTitle] = {
                        lectures : {
                            ...lectures
                        }
                    }
                }
                else
                new_existing_chapters[key] = courseStructure['Chapters'][key];
            })
            
            let newCourseStructure = {
                ...courseStructure,
                Chapters: {
                    ...new_existing_chapters
                }

            }
            return newCourseStructure;
        });
    }


    // Add new lecture
    function addNewLecture(lectureTitle,chapterTitle) {
        setCourseStructure(() => {
            let existing_chapters = courseStructure['Chapters'];
            let lectures = existing_chapters[chapterTitle]['lectures'];
            lectures[lectureTitle] = {
                lectureType : '',
                path : ''
            }
            let newCourseStructure = {
                ...courseStructure,
                Chapters: {
                    ...existing_chapters,
                    [chapterTitle] : {
                        lectures : {
                            ...lectures
                        }
                    }
                }
            }
            return newCourseStructure;
        })
        console.log(JSON.stringify(courseStructure));
    }

    // Update an existing lecture 
    function updateSpecificLecture(chapterTitle,lectureTitle,updatedTitle) {
        setCourseStructure(() => {
            let existing_chapters = courseStructure['Chapters'];
            let lectures = existing_chapters[chapterTitle]['lectures'];
            let new_lectures = {}
            console.log(lectureTitle);
            Object.keys(lectures).forEach((key) => {
                if (key == lectureTitle) 
                    new_lectures[updatedTitle] = lectures[key];
                else
                    new_lectures[key] = lectures[key];
            })
            let newCourseStructure = {
                ...courseStructure,
                Chapters : {
                    ...existing_chapters,
                    [chapterTitle] : {
                        lectures : {
                            ...new_lectures
                        }
                    }
                }
            }
            console.log(newCourseStructure);
            return newCourseStructure;

        })
    }


    // Delete lecture 
    function deleteLecture(chapterTitle,lectureTitle) {
        setCourseStructure(() => {
            let existing_chapters = courseStructure['Chapters'];
            let existing_lectures = existing_chapters[chapterTitle]['lectures'];
            let new_lectures = {}
            Object.keys(existing_lectures).forEach((key) => {
                if (key != lectureTitle) new_lectures[key] = existing_lectures[key];
            })
            let newCourseStructure = {
                ...courseStructure,
                Chapters : {
                    ...existing_chapters,
                    [chapterTitle] : {
                        lectures : {
                            ...new_lectures
                        }
                    }
                }
            }
            return newCourseStructure;
        })
        console.log(courseStructure);
    }
    // Delete chapter 
    function deleteChapter(chapterTitle) {
        setCourseStructure(() => {
            let existing_chapters = courseStructure['Chapters'];
            let newChapters = {}
            Object.keys(existing_chapters).forEach((key) => {
                if (key != chapterTitle) newChapters[key] = existing_chapters[key];
            })
            let newCourseStructure = {
                ...courseStructure,
                Chapters: {
                    ...newChapters 
                }
            }
            return newCourseStructure;
        })
    }
    function sendCourseRequest() {
        let json_data = {
            method : 'POST',
            headers : {
              'Content-Type' : 'application/json',
            },
            body : JSON.stringify(courseStructure)
          }
        fetch('http://localhost:3001/course_request', json_data).then(response => {
            return response.json();
        })
        .then((data) => {
            console.log(data,data.CourseID)
            setCourseStructure({
                ...courseStructure,
                CourseID : data.CourseID
            })
        })
        console.log(courseStructure);
    }
    return (
    <div className='LiveAcademy_createCourse_container'>
        <Header save_callback = {sendCourseRequest}/>
        <main className='LiveAcademy_main_container'>
            <div className={`LiveAcademy_content-course_title ${ errors.title[0] ? "close" : "" }`}>
                {
                    courseStructure.CourseTitle.length > 0
                    ?<h1 title = 'Edit Title' onClick = {()=> {updateCourseTitle('')}}>{courseStructure.CourseTitle}</h1>
                    : <>
                    <input 
                        autoFocus = {true}
                        id = "LiveAcademy_input_course_title" 
                        placeholder='Title of the course'
                        onFocus = {() => {
                            setErrors(errorsOptions.titleError(false));
                            console.log(errors.title)
                        }}
                        onKeyDown={(event) => {
                        if(event.key === 'Enter') {
                            updateCourseTitle(event.target.value);
                        }
                      }}></input>
                      <p className={`error ${ errors.title[0] ? "show" : "unshow" }`}>Course title required!</p>
                    </> 
                    
                }
            </div>
     
            
            <div id='LiveAcademy_course_template'>
                <div id='Add-New-Chapter'>
                    {
                        Object.keys(courseStructure['Chapters']).map(key => {
                            console.log(courseStructure['Chapters'][key]['lectures'])
                            return (
                                <>
                                    <NewChapter
                                        title = {key}
                                        callback = {updateChapter} 
                                        callback2 = {() => {setChartTitleOpen(false)}}
                                        add_lecture_callback = {addNewLecture}
                                        lectures = {courseStructure['Chapters'][key]['lectures']}
                                        delete_callback = {deleteChapter}
                                        updateLectureCallback={updateSpecificLecture}
                                        delete_lecture_callback={deleteLecture}
                                        key = {key} 
                                    />
                                </>
                            )
                        })
                    }
                        <div id='new_chapter_input'>
                        {
                            chartTitleOpen
                            ? <input 
                                autoFocus = {true}
                                onKeyDown = {(event) => {
                                    return (
                                        event.key === 'Enter' && event.target.value.length > 0
                                        ? addNewChapter(event.target.value) 
                                        : <></>
                                    )
                                    }}
                                placeholder='Title of the chapter'></input>
                            : <img src = {add} onClick={() => {
                                if(courseStructure.CourseTitle.length > 0)
                                    setChartTitleOpen(!chartTitleOpen)
                                else 
                                    setErrors(errorsOptions.titleError(true));
                            }}/>

                        }
                        </div>
                </div>
            </div>
        </main>
    </div>
    )
}

export default CourseCreator;
