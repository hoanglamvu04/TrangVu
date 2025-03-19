import React from "react";
import { Link } from "react-router-dom";
import "../styles/Breadcrumbs.css";

const Breadcrumbs = ({ categories }) => {
    return (
        <nav className="breadcrumbs">
            {categories.map((category, index) => (
                <span key={index}>
                    {index !== categories.length - 1 ? (
                        <Link to="/">{category} / </Link>
                    ) : (
                        <span>{category}</span>
                    )}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
