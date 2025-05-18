import React from 'react'
import { Col } from 'reactstrap'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'

const ProfileName = () => {
    const { user } = useUser();
    
    const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest User';
    const userRole = user?.role || 'Guest';
    
    return (
        <Col sm={12} xl={4} className="order-sm-0 order-xl-1">
            <div className="user-designation tour-email">
                <div className="title">
                    <Link href='/bonus-ui/tour' target='_blank'>
                        {fullName}
                    </Link>
                </div>
                <div className="desc mt-2">{userRole}</div>
            </div>
        </Col>
    )
}

export default ProfileName