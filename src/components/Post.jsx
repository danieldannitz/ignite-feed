import { useState } from "react";

import { Avatar } from "./Avatar";
import { Comment } from "./Comment";

import { format, formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/esm/locale/pt-BR/index.js";

import styles from "./Post.module.css";

export function Post({ author, publishedAt, content }) {
  const [comments, setComments] = useState(["Comentário bacana, hein?!"]); //useState vai receber o array de comments, setComments fica responsável por atualizar comments quando o mesmo for alterado
  const [newCommentText, setNewCommentText] = useState("");
  const dateFormat = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });

  const postDistanceToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  function handleNewComment() {
    event.preventDefault(); //previne a atualização por padrão do react

    setComments([...comments, newCommentText]);
    setNewCommentText(""); // após a inserção do comentario, volta para o valor inicial
  }

  function handleNewCommentChange() {
    event.target.setCustomValidity("");
    setNewCommentText(event.target.value);
  }

  function handleNewCommentInvalid() {
    event.target.setCustomValidity("Esse campo é obrigatório");
  }

  function deleteComment(commentToDelete) {
    const commentsWithoutDeletedOne = comments.filter((comment) => {
      return comment !== commentToDelete;
    });

    setComments(commentsWithoutDeletedOne);
  }

  const isNewCommentEmpty = newCommentText.length === 0;

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar hasBorder={true} src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>
        <time title={dateFormat} dateTime={publishedAt.toISOString()}>
          {postDistanceToNow}
        </time>
      </header>
      <div className={styles.content}>
        {content.map((comment) => {
          if (comment.type === "paragraph") {
            return <p key={comment.content}>{comment.content}</p>;
          } else if (comment.type === "link") {
            return (
              <p key={comment.content}>
                <a href="#">{comment.content}</a>
              </p>
            );
          }
        })}
      </div>
      <form onSubmit={handleNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>
        <textarea
          placeholder="Deixe um comentário"
          value={newCommentText} //toda vez que o valor mudar, a textarea vai refletir a alteração
          name="comment"
          onChange={handleNewCommentChange}
          onInvalid={handleNewCommentInvalid}
          required={true}
        />
        <button type="submit" disabled={isNewCommentEmpty}>
          Publicar
        </button>
      </form>
      <div className={styles.commentList}>
        {comments.map((comment) => {
          return (
            <Comment
              key={comment}
              content={comment}
              onDeleteComment={deleteComment}
            />
          );
        })}
      </div>
    </article>
  );
}
