import {GetStaticPropsContext, NextPage} from 'next';
import Head from 'next/head';
import { ssgHelper } from '~/server/api/ssgHelper';

const ProfilePage: NextPage = () => {
    return <>
        <Head>
            <title>{`Twitter Clone ${user.name}`}</title>
        </Head>
    
    </>
}

export const getStaticPaths: GetStaticPaths = () => {
    
}

export async function getStaticProps(context: GetStaticPropsContext<{id : string}>) {
    const id = context.params?.id

    if(id == null) {
        return {
            redirect: {
                destination: "/"
            }
        }
    }

    const ssg = ssgHelper()
    await ssg.profile.getById.prefetch({id})

    return {
        props: {
            trpcState: ssg.dehydrate(),
            id
        }
    }
}

export default ProfilePage