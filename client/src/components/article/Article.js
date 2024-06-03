import "./Article.css";
import { useLocation } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { axiosWithToken } from "../../axiosWithToken";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FcClock } from "react-icons/fc";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { FcCalendar } from "react-icons/fc";
import { FcComments } from "react-icons/fc";
import { FcPortraitMode } from "react-icons/fc";
import { BiCommentAdd } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { MdRestore } from "react-icons/md";

function Article() {
  const { state } = useLocation();
  let { currentUser } = useSelector(
    (state) => state.userAuthoruserAuthorLoginReducer
  );

  let { register, handleSubmit } = useForm();
  let [comment, setComment] = useState("");
  let navigate = useNavigate();
  let [articleEditStatus, setArticleEditStatus] = useState(false);
  let [currentArticle, setCurrentArticle] = useState(state);

  const deleteArticle = async() => {
    let art={...currentArticle};
    delete art._id;
    let res=await axiosWithToken.put(`http://localhost:4000/author-api/article/${currentArticle.articleId}`,art)
    if(res.data.message==='article deleted'){
      setCurrentArticle({...currentArticle,status:res.data.payload})
    }
  };

  const restoreArticle =async () => {
    let art={...currentArticle};
    delete art._id;
    let res=await axiosWithToken.put(`http://localhost:4000/author-api/article/${currentArticle.articleId}`,art)
    if(res.data.message==='article restored'){
      setCurrentArticle({...currentArticle,status:res.data.payload})
    }
  };

  //add comment top an article by user
  const writeComment = async (commentObj) => {
    commentObj.username = currentUser.username;
    let res = await axiosWithToken.post(
      `http://localhost:4000/user-api/comment/${state.articleId}`,
      commentObj
    );
    if (res.data.message === "Comment posted") {
      setComment(res.data.message);
    }
  };

  //enable edit state
  const enableEditState = () => {
    setArticleEditStatus(true);
  };

  //disable edit state
  const saveModifiedArticle = async (editedArticle) => {
    let modifiedArticle = { ...state, ...editedArticle };
    //change date of modification
    modifiedArticle.dateOfModification = new Date();
    //remove _id
    delete modifiedArticle._id;

    //make http put req to save modified article in db
    let res = await axiosWithToken.put(
      "http://localhost:4000/author-api/article",
      modifiedArticle
    );
    if (res.data.message === "Article modified") {
      setArticleEditStatus(false);
      navigate(`/author-profile/article/${modifiedArticle.articleId}`, {
        state: res.data.article,
      });
    }
  };

  //convert ISO date to UTC data
  function ISOtoUTC(iso) {
    let date = new Date(iso).getUTCDate();
    let day = new Date(iso).getUTCDay();
    let year = new Date(iso).getUTCFullYear();
    return `${date}/${day}/${year}`;
  }

  return (
    <div>
      {articleEditStatus === false ? (
        <>
          <div className="d-flex justify-content-between">
            <div>
              <p className="display-3 me-4">{state.title}</p>
              <span className="py-3">
                <small className=" text-secondary me-4">
                  <FcCalendar className="fs-4" />
                  Created on:{ISOtoUTC(state.dateOfCreation)}
                </small>
                <small className=" text-secondary">
                  <FcClock className="fs-4" />
                  Modified on: {ISOtoUTC(state.dateOfModification)}
                </small>
              </span>
            </div>
            <div>
              {currentUser.userType === "author" && (
                <>
                 
                  <button
                    className="me-2 btn btn-warning "
                    onClick={enableEditState}
                  >
                    <CiEdit className="fs-2" />
                  </button>
                  {currentArticle.status === true ? (
                    <button
                      className="me-2 btn btn-danger"
                      onClick={deleteArticle}
                    >
                      <MdDelete className="fs-2" />
                    </button>
                  ) : (
                    <button
                      className="me-2 btn btn-info"
                      onClick={restoreArticle}
                    >
                      <MdRestore className="fs-2" />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <p className="lead mt-3" style={{ whiteSpace: "pre-line" }}>
            {state.content}
          </p>
          {/* user comments */}
          <div>
            {/* read existing comments */}
            <div className="comments my-4">
              {state.comments.length === 0 ? (
                <p className="display-3">No comments yet...</p>
              ) : (
                state.comments.map((commentObj, ind) => {
                  return (
                    <div key={ind} className="bg-light  p-3">
                      <p
                        className="fs-4"
                        style={{
                          color: "dodgerblue",
                          textTransform: "capitalize",
                        }}
                      >
                        <FcPortraitMode className="fs-2 me-2" />
                        {commentObj.username}
                      </p>

                      <p
                        style={{
                          fontFamily: "fantasy",
                          color: "lightseagreen",
                        }}
                        className="ps-4"
                      >
                        <FcComments className="me-2" />
                        {commentObj.comment}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            <h1>{comment}</h1>
            {/* write comment by user */}
            {currentUser.userType === "user" && (
              <form onSubmit={handleSubmit(writeComment)}>
                <input
                  type="text"
                  {...register("comment")}
                  className="form-control mb-4 "
                  placeholder="Write comment here...."
                />
                <button type="submit" className="btn btn-success">
                  Add a Comment <BiCommentAdd className="fs-3" />
                </button>
              </form>
            )}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit(saveModifiedArticle)}>
          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              {...register("title")}
              defaultValue={state.title}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="form-label">
              Select a category
            </label>
            <select
              {...register("category")}
              id="category"
              className="form-select"
              defaultValue={state.category}
            >
              <option value="programming">Programming</option>
              <option value="AI&ML">AI&ML</option>
              <option value="database">Database</option>
              <option value="Technology">Technology</option>
              <option value="Android Development">Android Development</option>
              <option value="Web Development">Web Development</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="form-label">
              Content
            </label>
            <textarea
              {...register("content")}
              className="form-control"
              id="content"
              rows="10"
              defaultValue={state.content}
            ></textarea>
          </div>

          <div className="text-end">
            <button type="submit" className="btn btn-success">
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Article;
