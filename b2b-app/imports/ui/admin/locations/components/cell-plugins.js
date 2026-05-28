import image from '@react-page/plugins-image'
import divider from '@react-page/plugins-divider'
import spacer from '@react-page/plugins-spacer'
import slate from '@react-page/plugins-slate'
import courseInfo from './plugins/course-info'

const cellPlugins = (data) => {
  return [
    slate(),
    image,
    divider,
    spacer,
    courseInfo('title', data?.title, 'h1'),
    courseInfo('description', data?.description, 'body1'),
    courseInfo('difficulty', data?.difficulty, 'body1'),
  ]
}

export default cellPlugins
