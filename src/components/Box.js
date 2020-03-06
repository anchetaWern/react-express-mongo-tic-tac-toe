import React from "react";

const Box = ({ text, onClick }) => {
	return (
		<div className="box" onClick={onClick}>
			{text}
		</div>
	);
};
//
export default Box;
