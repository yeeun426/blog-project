import { useState } from 'react'
import QuillEditor from '../components/QuillEditor'
import css from './createpost.module.css'
import { useNavigate } from 'react-router-dom'

export const CreatePost = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [files, setFiles] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleContentChange = () => {
    setContent(content)
  }

  const createPost = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      if (!title || !summary || !content) {
        setError('모든 필드를 입력해주세요')
        return
      }

      const data = new FormData()
      data.set('title', title)
      data.set('summary', summary)
      data.set('content', content)

      if (files[0]) {
        data.set('files', files[0])
      }

      try {
        setIsSubmitting(true)
        const postData = await createPost(data)
        console.log('등록성공', postData)

        setIsSubmitting(false)
        navigate('/')
      } catch (err) {
        console.log(err)
      }
    } catch (err) {
      console.log(err)
      setError('', err.message)
    } finally {
      setIsSubmitting(false)
      setError('')
    }
  }
  return (
    <main className={css.createpost}>
      <h2>글쓰기</h2>
      <form className={css.writecon} onSubmit={createPost}>
        <label htmlFor="title">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <label htmlFor="summary">요약내용</label>
        <input
          type="text"
          id="summary"
          name="summary"
          value={summary}
          onChange={e => setSummary(e.target.value)}
        />
        <label htmlFor="files">파일</label>
        <input
          type="file"
          id="files"
          name="files"
          accept="image/*"
          value={files}
          onChange={e => setFiles(e.target.value)}
        />
        <label htmlFor="content">내용</label>
        <div className={css.editorWrapper}>
          <QuillEditor
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력해주세요"
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '등록중...' : '등록'}
        </button>
      </form>
    </main>
  )
}
