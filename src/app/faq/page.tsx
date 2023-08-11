import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading
} from '@/components/page-header'

const Faq = () => {
    return (
        <>
            <div className='container'>
                <PageHeader>
                    <PageHeaderHeading>FAQ</PageHeaderHeading>
                    <PageHeaderDescription>
                        Got questions? We got answers.
                    </PageHeaderDescription>
                </PageHeader>
            </div>
        </>
    )
}

export default Faq
