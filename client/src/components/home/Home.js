import "./Home.css";
import articleImage from "../../assets/Article-Writing-1.jpg";

function Home() {
  return (
    <div className='articleHome'>
      <h1 style={{color:'var(--crimson)'}}> Technology Changes Future</h1>
      <img src={articleImage} alt="" className="artcleImage" />
      <p className="lead">
      <b>Technology has become an integral part of our lives, permeating every aspect of society. 
      From the way we communicate and work to how we learn and entertain ourselves, technology has revolutionized the world. 
      In this article, we will explore the immense importance of technology in our modern society, highlighting its impact on various sectors and its role in shaping our future.
</b>
      </p>
    </div>
  );
}

export default Home;
