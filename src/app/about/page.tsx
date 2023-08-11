import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'

const About = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>About</PageHeaderHeading>
                    <PageHeaderDescription>
                        Let me tell you a story.
                    </PageHeaderDescription>
                </PageHeader>
            </div>
        </>
    )
}

export default About
