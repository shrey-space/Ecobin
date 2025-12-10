import React from "react";
import { motion } from "framer-motion";
import "./News.css";

const News = () => {
  const newsArticles = [
    {
      title: "India Leads in Blue Waste Recycling Initiatives",
      description:
        "Over 60% of urban societies across major cities have started segregating blue waste. The initiative is expected to reduce landfill pressure and promote eco-friendly urban living.",
      image:
        "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=900&q=80",
      date: "October 6, 2025",
      source: "The Environmental Times",
    },
    {
      title: "How Technology Is Revolutionizing Waste Collection",
      description:
        "AI-driven waste tracking systems are helping municipalities monitor recycling performance in real-time, making waste management smarter and more efficient.",
      image:
        "https://images.unsplash.com/photo-1599586120429-9d58e2c90a0d?auto=format&fit=crop&w=900&q=80",
      date: "October 3, 2025",
      source: "EcoWorld News",
    },
    {
      title: "Recycling Plastic: Turning Waste Into Opportunity",
      description:
        "Startups across India are transforming plastic waste into useful household items, showcasing the economic value of circular waste management.",
      image:
        "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80",
      date: "October 2, 2025",
      source: "Green Planet Daily",
    },
    {
      title: "Blue Waste Segregation Awareness Rising Among Youth",
      description:
        "Colleges and residential societies are conducting weekly awareness drives about the importance of separating blue waste from regular garbage.",
      image:
        "https://images.unsplash.com/photo-1605810230434-7638b3a3e65f?auto=format&fit=crop&w=900&q=80",
      date: "September 30, 2025",
      source: "Urban Eco Press",
    },
  ];

  return (
    <div className="news-container">
      <h2 className="news-title">🌍 Latest Environmental & Recycling Updates</h2>
      <p className="news-subtitle">
        Explore the latest highlights from the world of sustainability, waste recycling, and green innovation.
      </p>

      {/* Featured News Section */}
      <motion.div
        className="featured-news"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img
          src={newsArticles[0].image}
          alt="Featured News"
          className="featured-image"
        />
        <div className="featured-content">
          <h3>{newsArticles[0].title}</h3>
          <p>{newsArticles[0].description}</p>
          <div className="featured-meta">
            <span>{newsArticles[0].source}</span> |{" "}
            <span>{newsArticles[0].date}</span>
          </div>
        </div>
      </motion.div>

      {/* Other News in Grid */}
      <div className="news-grid">
        {newsArticles.slice(1).map((article, index) => (
          <motion.div
            className="news-card"
            key={index}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <img src={article.image} alt={article.title} />
            <div className="news-info">
              <h4>{article.title}</h4>
              <p>{article.description}</p>
              <div className="news-meta">
                <span>{article.source}</span> | <span>{article.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default News;
