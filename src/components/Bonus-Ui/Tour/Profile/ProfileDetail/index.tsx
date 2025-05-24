import React from 'react'
import { Row } from 'reactstrap'
import ProfileMail from './ProfileMail'
import ProfileName from './ProfileName'
import ProfileContect from './ProfileContect'
import ProfileFollower from './ProfileFollower'

const ProfileDetail = () => {
    return (
        <div className="info">
            <Row className="g-3 step3">
                <ProfileMail />
                <ProfileName />
                <ProfileContect />
            </Row>
            <hr />
            <ProfileFollower />
        </div>

    )
}

export default ProfileDetail