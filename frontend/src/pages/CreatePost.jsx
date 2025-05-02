import { useState } from 'react'
import QuillEditor from '../components/QuillEditor'
import css from './createpost.module.css'
import { useNavigate } from 'react-router-dom'
import { createPost } from '../apis/postApi'

export const CreatePost = () => {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [files, setFiles] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleContentChange = content => {
    setContent(content)
  }

  const handleCreatePost = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    console.log(files)

    if (!title || !summary || !content) {
      setIsSubmitting(false)
      setError('제목, 요약내용, 내용을 모두 입력해주세요.')
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
      await createPost(data)
      console.log('등록 성공')
      setIsSubmitting(false)
      navigate('/')
    } catch (err) {
      console.log(err)
    } finally {
      setIsSubmitting(false)
      setError('')
    }
  }

  return (
    <main className={css.createpost}>
      <h2>글쓰기</h2>
      <form className={css.writecon} onSubmit={handleCreatePost}>
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
          onChange={e => setFiles(e.target.files)}
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
