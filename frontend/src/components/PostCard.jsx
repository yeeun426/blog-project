import { useNavigate } from 'react-router-dom'
import css from './postcard.module.css'

const PostCard = ({ post }) => {
  const navigate = useNavigate()
  const { title, summary, createdAt, author, cover, _id } = post || {}
  const goDetailPage = () => {
    navigate(`/post/${_id}`)
  }

  return (
    <article className={css.postcard} onClick={goDetailPage}>
      <h3>{title}</h3>
      <p className={css.img}>
        <img src={`${import.meta.env.VITE_BACK_URL}/${cover}`} alt="이미지이름" />
      </p>
      <p className={css.title}>{summary}</p>
      <p className={css.createdAt}>{createdAt}</p>
      <p className={css.author}>{author}</p>
    </article>
  )
}

export default PostCard
