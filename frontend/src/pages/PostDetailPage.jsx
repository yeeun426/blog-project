import { useParams } from 'react-router-dom'
import css from './postdetailpage.module.css'
import { useEffect, useState } from 'react'
import { getPostDetiail } from '../apis/postApi'
import DOMPurify from 'dompurify'
import { formatDate } from '../utils/features'

export const PostDetailPage = () => {
  const { postId } = useParams()
  const [post, setPost] = useState({})

  const cleanHtml = DOMPurify.sanitize(post?.content)
  console.log('cleanHtml', cleanHtml)

  useEffect(() => {
    const fetchPostDeatail = async () => {
      try {
        const res = await getPostDetiail(postId)
        console.log('res', res)
        setPost(res)
      } catch (err) {
        console.log('에러', err)
      }
    }
    fetchPostDeatail()
  }, [postId])

  return (
    <main className={css.postdetailpage}>
      <h2>상세페이지</h2>
      <section className={css.postSection}>
        <div className={css.detail_img}>
          <img src={`${import.meta.env.VITE_BACK_URL}/${post.cover}`} alt={post.title} />
          <h3>{post.title}</h3>
        </div>
        <div className={css.info}>
          <p className={css.author}>{post.author}</p>
          <p className={css.date}>{formatDate(post.createdAt)}</p>
        </div>
        <div className={css.summary}>{post.summary}</div>
        <div className={css.content} dangerouslySetInnerHTML={{ __html: cleanHtml }}></div>
      </section>
      <div className={css.btns}>
        <button>수정</button>
        <button>삭제</button>
        <button>목록</button>
      </div>
      <section className={css.comments}>댓글 리스트</section>
    </main>
  )
}
