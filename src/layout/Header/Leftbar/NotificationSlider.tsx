import dynamic from 'next/dynamic';
import React from 'react'

const Slider = dynamic(() => import('react-slick'), { ssr: false })

const NotificationSlider = () => {
    const notificationSliderOption = { 
        slidesToShow: 1, 
        slidesToScroll: 1, 
        dots: false, 
        vertical: true, 
        variableWidth: false, 
        autoplay: true, 
        autoplaySpeed: 2500, 
        arrows: false 
    };

    return (
        <Slider className='notification-slider overflow-hidden m-0' {...notificationSliderOption}>
            <div className='d-flex h-100 justify-content-center align-items-center'>
                <h6 className='mb-0 f-w-400'>
                    <span className='font-primary'>Today's Schedule: </span>
                    <span className='f-light'>15 appointments scheduled</span>
                </h6>
            </div>
            <div className='d-flex h-100 justify-content-center align-items-center'>
                <h6 className='mb-0 f-w-400'>
                    <span className='font-primary'>New Updates: </span>
                    <span className='f-light'>5 lab reports pending review</span>
                </h6>
            </div>
            <div className='d-flex h-100 justify-content-center align-items-center'>
                <h6 className='mb-0 f-w-400'>
                    <span className='font-primary'>Reminder: </span>
                    <span className='f-light'>Staff meeting at 2:00 PM</span>
                </h6>
            </div>
        </Slider>
    )
}

export default NotificationSlider