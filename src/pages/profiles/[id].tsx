import {NextPage} from 'next';
import Head from 'next/head';

const ProfilePage: NextPage = () => {
    return <>
        <Head>
            <title>{`Twitter Clone ${user.name}`}</title>
        </Head>
    
    </>
}

export async function getStaticProps(context: GetStaticPathsContext<{id : string}>) {
    const id = context.params.id

    if(id == null) {
        return {
            redirect: {
                destination: "/"
            }
        }
    }
}

export default ProfilePage