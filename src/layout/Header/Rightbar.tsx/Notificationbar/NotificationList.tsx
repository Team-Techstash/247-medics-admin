import React, { useState } from 'react'
import { Checkall } from 'utils/Constant'

const NotificationList = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            message: "New appointment request from",
            name: "John Smith",
            time: "5 min ago",
            type: "primary"
        },
        {
            id: 2,
            message: "Patient",
            name: "Sarah Johnson",
            suffix: "completed their checkup",
            time: "1 hr ago",
            type: "success"
        },
        {
            id: 3,
            message: "Dr.",
            name: "Michael Brown",
            suffix: "updated patient records",
            time: "2 hr ago",
            type: "secondary"
        },
        {
            id: 4,
            message: "Lab results for",
            name: "Emma Wilson",
            suffix: "are ready",
            time: "3 hr ago",
            type: "warning"
        }
    ]);

    const handleCheckAll = (e: React.MouseEvent) => {
        e.preventDefault();
        setNotifications([]);
    };

    if (notifications.length === 0) {
        return (
            <ul className='simple-list'>
                <li className="text-center py-3">
                    <p>No new notifications</p>
                </li>
                <li><a className="f-w-700" href="#">{Checkall}</a></li>
            </ul>
        );
    }

    return (
        <ul className='simple-list'>
            {notifications.map((notification) => (
                <li key={notification.id} className={`b-l-${notification.type} border-4`}>
                    <p>
                        {notification.message} <span className="font-primary">{notification.name}</span>
                        {notification.suffix && ` ${notification.suffix}`}
                        <span className={`font-${notification.type}`}> {notification.time}</span>
                    </p>
                </li>
            ))}
            <li><a className="f-w-700" href="#" onClick={handleCheckAll}>{Checkall}</a></li>
        </ul>
    )
}

export default NotificationList