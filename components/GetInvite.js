import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import en from '../locales/en';
import ar from '../locales/ar';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import CountryCode from './CountryDropdown';
import $ from 'jquery'
import Image from "next/image";

const GetInviteForm = ({ blok }) => {


    const [submitMsg, showSubmitMsg] = useState(false)
    const [inviteRes, setInviteRes] = useState(null);
    const [faceDe, setFaceDe] = useState(null)
    const router = useRouter();
    const { locale } = router;
    const t = locale === 'en' ? en : ar;
    console.log('locale',router)
    function hbData(email, firstname, lastname, agree, dataurl) {
        // Create the new request
        let xhr = new XMLHttpRequest();
        let url = `https://api.hsforms.com/submissions/v3/integration/submit/20773544/4b707dab-48f8-427f-80a2-7ca99c710d44`
        // let fname = document.getElementById('firstname').value
        // let lname = document.getElementById('lastname').value
        // let email = document.getElementById('email').value
        // let coun  = document.getElementById('phonecode').value
        // let phone  = document.getElementById('phone').value
        //alert(dataurl)
        window.getCookie_new = function (name) {
            document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        }
        const data = {
            "submittedAt": Date.now(),
            "fields": [
                {
                    "name": "email",
                    "value": email
                },
                {
                    "name": "firstname",
                    "value": firstname
                },
                {
                    "name": "lastname",
                    "value": lastname,
                },
                {
                    "name": "phone",
                    "value": '0000000000',
                },
                {
                    "name": "upload_image",
                    "value": dataurl,
                },
                {
                    "name": "preferred_language",
                    "value": locale == 'en' ? "English" : "Arabic",
                },
                // {
                //     "name": "agree",
                //     "value": agree == true ? 'Yes' : 'No',
                // },

            ],
            "skipValidation": true,
            "context": {
                "hutk": getCookie_new("hubspotutk"),
                "pageUri": window.location.href,
                "pageName": document.title
            },

        }

        const final_data = JSON.stringify(data)
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                showSubmitMsg(true);
            } else if (xhr.readyState == 4 && xhr.status == 400) {
                alert(xhr.responseText);
            } else if (xhr.readyState == 4 && xhr.status == 403) {
                alert(xhr.responseText);
            } else if (xhr.readyState == 4 && xhr.status == 404) {
                alert(xhr.responseText);
            }
        }

        xhr.send(final_data)
    }

    const phoneRegex = RegExp(
        /[0-9]/
    );
    const DisplayingErrorMessagesSchema = Yup.object().shape({
        firstname: Yup.string()
            .required(locale == 'en' ? 'Please complete this required field.' : 'الرجاء إكمال هذا الحقل المطلوب.'),
        lastname: Yup.string()
            .required(locale == 'en' ? 'Please complete this required field.' : 'الرجاء إكمال هذا الحقل المطلوب.'),
        phone: Yup.string()
            .matches(phoneRegex, locale == 'en' ? 'Please enter valid phone number' : 'الرقم الذي أدخلته ليس في النطاق.').required(locale == 'en' ? 'Please complete this required field.' : 'الرجاء إكمال هذا الحقل المطلوب.')
            .min(7, locale == 'en' ? 'The number you entered is not in range.' : 'الرقم الذي أدخلته ليس في النطاق.')
            .max(12, locale == 'en' ? 'The number you entered is not in range.' : 'الرقم الذي أدخلته ليس في النطاق.'),
        email: Yup.string().email(locale == 'en' ? 'Please enter valid email' : 'الرجاء إكمال هذا الحقل المطلوب.').required(locale == 'en' ? 'Please complete this required field.' : 'الرجاء إكمال هذا الحقل المطلوب.'),
        agree: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required')
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const invite = urlParams.get('invite');
        if (invite) {
            fetch(`https://fap-exec-inpl-ema-dev.azurewebsites.net/api/GetInvite?invite=${invite}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-functions-key': 'Z2JBa8tbV3UskQCabTuTHO-prkVZfWfUUp8T4FNm20sVAzFu3ix49A=='
                }
            })
                .then(response => response.json())
                .then(response => {
                    let resData = response.results[0].properties
                    setInviteRes(resData);

                    // document.getElementById('firstname').setAttribute('value',resData.firstname)
                    // document.getElementById('lastname').setAttribute('value', resData.lastname)
                    // document.getElementById('email').setAttribute('value', resData.email)

                    //console.log('data', response.results[0].properties);

                })
        }

        

    }, [])


    
    return (
        <div id="contactForm" className={`px-4 relative py-20`} >
            <style jsx>{`
                .phonedropdown {
                    background-image: url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iaW5saW5lLWJsb2NrIiB3aWR0aD0iMTIiIGhlaWdodD0iNyIgdmlld0JveD0iMCAwIDEyIDciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTAuMjQ0MjkzIDEuNDM2NDJMNS41OTI3IDYuODI5NTdDNS44MTc4NCA3LjA1NjgxIDYuMTgxNTggNy4wNTY4MSA2LjQwNzMgNi44Mjk1N0wxMS43NTU3IDEuNDM2NDJDMTIuMDgxNCAxLjEwODM4IDEyLjA4MTQgMC41NzQ2NTQgMTEuNzU1NyAwLjI0NjAzQzExLjQzIC0wLjA4MjAxMDMgMTAuOTAxMyAtMC4wODIwMTAzIDEwLjU3NTYgMC4yNDYwM0w1Ljk5OTcxIDQuODU5NThMMS40MjQ5NiAwLjI0NjAzQzEuMDk4NjYgLTAuMDgyMDEwMyAwLjU3MDAxNiAtMC4wODIwMTAzIDAuMjQ0MjkzIDAuMjQ2MDNDLTAuMDgxNDI5NSAwLjU3NDY1NCAtMC4wODE0Mjk1IDEuMTA4MzggMC4yNDQyOTMgMS40MzY0MloiIGZpbGw9IiNCOTk4NTUiLz4KICAgICAgICAgICAgICAgICAgICA8L3N2Zz4=) !important;
                    background-repeat: no-repeat;
                    background-position: calc(100% - 10px) center !important;
                }
              `}</style>



            <div className="max-w-screen-lg mx-auto">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-2/5 md:pr-4">
                        {/* <h2 className="text-md md:text-lg mb-3">{blok.title}</h2>
                        <p>{blok.description}</p> */}
                        <img src="../images/pexels-pixabay-220453.jpg" id="originalImg" width="300" height="300" style={{ objectFit: 'cover' }} />

        <canvas id="reflay" className="overlay hidden"></canvas>
                    </div> 
                    <div className="w-full md:w-3/5 ">
                        <Formik
                            initialValues={{ email: inviteRes?.email, firstname: inviteRes?.firstname, lastname: inviteRes?.lastname, phone: '0000000000', agree: false, upload_image: '' }}
                            enableReinitialize
                            validationSchema={DisplayingErrorMessagesSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                // var file = document.querySelector('input[type=file]')['files'][0];
                                // var reader = new FileReader();
                                // reader.onload = function () {
                                //     base64String = reader.result.replace("data:", "")
                                //         .replace(/^.+,/, "");
                                //     let imageBase64Stringsep = base64String;
                                // }
                                // reader.readAsDataURL(file);

                                let dataurl = ''
                                
                                let imageFile = document.querySelector('input[type=file]')['files'][0];
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    var img = document.createElement("img");
                                    img.onload = function (event) {
                                        // Dynamically create a canvas element
                                        var canvas = document.createElement("canvas");
                                       canvas.width = 260;
                                        canvas.height = 400;
                                        // var canvas = document.getElementById("canvas");
                                        var ctx = canvas.getContext("2d");
                                        //var myImage = new Image();
                                        // Actual resizing
                                        console.log('img.width',canvas.width / img.width)
                                        console.log('img.height',canvas.height / img.height)
                                        var factor  = Math.min ( canvas.width / img.width, canvas.height / img.height );
                                        console.log('factor',factor)
                                        ctx.scale(factor, factor);
                                        ctx.drawImage(img, 0, 0);
                                        ctx.scale(1, 1 / factor);
                                        //ctx.drawImage(img, 0, 0, 1000, 600);
                
                                        // Show resized image in preview element
                                        dataurl = canvas.toDataURL(imageFile.type);
                                       // document.getElementById("preview").src = dataurl;
                                       // console.log(dataurl)
                                    }
                                    img.src = e.target.result;
                                   // alert(dataurl)
                                }
                                reader.readAsDataURL(imageFile);
                                

                                let faceDescriptions = ''
                                async function face(subject, callback) {
                                    const MODEL_URL = '/models'
                                    await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
                                    await faceapi.loadFaceLandmarkModel(MODEL_URL)
                                    await faceapi.loadFaceRecognitionModel(MODEL_URL)
                                    await faceapi.loadFaceExpressionModel(MODEL_URL)
                              
                                    const img = document.getElementById('originalImg')
                                    img.src = dataurl;
                                    faceDescriptions = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors().withFaceExpressions()
                                    const canvas = $('#reflay').get(0)
                                    faceapi.matchDimensions(canvas, img)
                              
                                    faceDescriptions = faceapi.resizeResults(faceDescriptions, img)
                                    faceapi.draw.drawDetections(canvas, faceDescriptions)
                                    faceapi.draw.drawFaceLandmarks(canvas, faceDescriptions)
                                    faceapi.draw.drawFaceExpressions(canvas, faceDescriptions)
                                   
                                  //  console.log('e.target.result',dataurl)

                                    console.log('faceDescriptions', faceDescriptions[0]?.detection?._classScore)
                                    console.log('faceDescriptions 2', faceDescriptions[0]?.expressions);
                                    setFaceDe(faceDescriptions[0])
                                    callback()
                                  }

                                  face('math', function() {
                                    console.log('faceDescriptionsfaceDescriptions',faceDescriptions);
                                    if(faceDescriptions[0]?.detection) {
                                        showSubmitMsg(true)
                                    } else {
                                        alert('Retake photo');
                                        window.location.reload(true);
                                    }
                                  });
                                 // face();

                                  setTimeout(function () {
                                    // alert(dataurl);
                                    
                                    
                                    
                                   //  hbData(values.email, values.firstname, values.lastname, values.agree, dataurl);
                                    console.log('teee', values.email, values.firstname, values.lastname, values.agree, values.upload_image);
                                    //setSubmitting(false);
                                    // if(faceDescriptions[0].detection) {
                                    //     showSubmitMsg(true)
                                    // } else {
                                    //     alert('Retake photo')
                                    // }
                                }, 1000)
                                
          
                                
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                /* and other goodies */
                            }) => (
                                <>
                                    {submitMsg !== true ?
                                        <form onSubmit={handleSubmit} autoComplete="off">
                                            <div className="flex flex-wrap">
                                                <div
                                                    className="form-group form-element w-full lg:w-1/2 md:w-1/2 md:px-2 ">
                                                    <input
                                                        type="text"
                                                        name="firstname"
                                                        id="firstname"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        defaultValue={inviteRes?.firstname}
                                                        className={`form-control hs-input w-full bg-secondary h-10 p-4 ${errors.firstname && touched.firstname ? 'invalid border-1 border-[#c87872]' : 'valid'}`}
                                                        placeholder={t.firstname}
                                                    />
                                                    <span
                                                        className={'text-sm block text-primary mt-1'}>{errors.firstname && touched.firstname && errors.firstname}</span>
                                                </div>
                                                <div className="form-group form-element w-full lg:w-1/2 md:w-1/2 md:px-2">
                                                    <input
                                                        type="text"
                                                        name="lastname"
                                                        id="lastname"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        defaultValue={inviteRes?.lastname}
                                                        className={`form-control hs-input w-full bg-secondary h-10 p-4 ${errors.lastname && touched.lastname ? 'invalid border-1 border-[#c87872]' : 'valid'}`}
                                                        placeholder={t.lastname}
                                                    />
                                                    <span
                                                        className={'text-sm block text-primary mt-1'}>{errors.lastname && touched.lastname && errors.lastname}</span>
                                                </div>
                                                {/* <div className={'form-group flex flex-wrap md:px-2 w-full'}
                                                     style={{direction: "ltr"}}>
                                                    <div className="form-element w-full lg:w-1/2 md:w-1/2 md:pr-2">
                                                        <select
                                                            name="phonecode"
                                                            id="phonecode"
                                                           // onChange={handleChange}
                                                            defaultValue={'+966'}
                                                            className={`form-control phonedropdown hs-input w-full bg-secondary h-10 p-4 ${errors.phonecode ? 'border-1 border-[#c87872]' : 'valid'}`}
                                                        >
                                                            <CountryCode/>
                                                        </select>
                                                    </div>
                                                    <div className="form-element w-full lg:w-1/2 md:w-1/2 md:pl-2">
                                                        <input
                                                            type="text"
                                                            name="phone"
                                                            id="phone"
                                                           // onChange={handleChange}
                                                           // onBlur={handleBlur}
                                                           defaultValue={values.phone}
                                                            className={`form-control hs-input w-full bg-secondary h-10 p-4 ${locale == 'ar' && 'text-right'} ${errors.phone && touched.phone ? 'invalid border-1 border-[#c87872]' : 'valid'}`}
                                                            placeholder={t.phone}
                                                        />
                                                        <span
                                                            className={'text-sm block text-primary mt-1 rtl:text-right'} dir={locale == 'ar' ? 'rtl' : 'ltr'}>{errors.phone && touched.phone && errors.phone}</span>
                                                    </div>
                                                </div> */}
                                                <div className="form-group form-element w-full md:px-2">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        id="email"
                                                        onChange={handleChange}
                                                         onBlur={handleBlur}
                                                        defaultValue={inviteRes?.email}
                                                        className={`form-control hs-input w-full bg-secondary h-10 p-4 ${errors.email && touched.email ? 'invalid border-1 border-[#c87872]' : 'valid'}`}
                                                        placeholder={t.email}
                                                    />
                                                    <span
                                                        className={'text-sm block text-primary mt-1'}>{errors.email && touched.email && errors.email}</span>
                                                </div>
                                                <div className="form-group form-element w-full md:px-2">
                                                    <input
                                                        type="file"
                                                        id="upload_image"
                                                        name="upload_image"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        accept="image/*"
                                                        capture="user" />


                                                <img className="hidden" width="50" height="50" id="preview"></img>
                                                </div>

                                                <div className="form-group form-element w-full md:px-2">
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            name="agree"
                                                            id="agree"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            defaultValue={true}
                                                            className={`form-control hs-input w-full bg-secondary h-10 p-4 ${errors.agree && touched.agree ? 'invalid border-1 border-[#c87872]' : 'valid'}`}
                                                        /><span>Accept Terms & Conditions</span>
                                                    </label>
                                                    <span
                                                        className={'text-sm block text-primary mt-1'}>{errors.agree && touched.agree && errors.agree}</span>
                                                </div>
                                                <div className="form-group form-element w-full md:px-2">

                                                    <button type="submit" disabled={isSubmitting}
                                                        className="btn-secondary bg-black text-white p-4  w-full md:w-[200px]">
                                                        {t.contact_me}
                                                    </button>
                                                </div>
                                                {/* {blok.additional_info &&
                                                    <div className="form-group form-element w-full md:px-2 pt-3">
                                                        <p className="text-sm">{blok.additional_info}</p>
                                                    </div>
                                                } */}
                                            </div>
                                        </form>
                                        :
                                        <div className="submittedmessage mt-4">
                                            {locale == 'ar' ?
                                                <>
                                                    <p>شكراً لك لاهتمامك في The Family Office.</p>
                                                    <p style={{ fontSize: '14px', color: '#c7c7c7' }}>سيتواصل معك أحد أعضاء الفريق قريباً</p>
                                                </>
                                                :
                                                <>
                                                    <p>
                                                        Thank you for your interest in The Family Office.
                                                    </p>
                                                    <p style={{ fontSize: '14px', color: '#c7c7c7' }}>A member of our team will contact you shortly.</p>
                                                </>
                                            }
                                        </div>
                                    }
                                </>
                            )}
                        </Formik>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default GetInviteForm;