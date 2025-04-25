// components/FullScreenLoader.jsx
import React from "react";
import Loader from "react-js-loader";

export default function FullScreenLoader({ show }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
            <Loader
                type="bubble-loop"
                bgColor={"#ffffff"}
                color={"#ffffff"}
                size={100}
            />
        </div>
    );
}
