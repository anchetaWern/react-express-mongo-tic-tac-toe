import React, { useContext, useEffect } from "react";
import axios from "axios";
import { PostsStateContext } from "../App";

function PostsWidget() {
	const { postsState, dispatch } = useContext(PostsStateContext);

	useEffect(() => {
		const url = postsState.query
			? `https://jsonplaceholder.typicode.com/posts?userId=${postsState.query}`
			: "https://jsonplaceholder.typicode.com/posts";
		axios
			.get(url)
			.then(res => {
				console.log("res: ", res.data);

				dispatch({ type: "SET_POST", data: res.data });
			})
			.catch(err => {
				console.log("error occurred: ", err);
			});
	}, [postsState.isLoading]);

	return (
		<div>
			<input
				type="text"
				name="query"
				value={postsState.query}
				onChange={e =>
					dispatch({ type: "SET_QUERY", data: e.target.value })
				}
			/>

			{postsState.isLoading && <div>loading..</div>}

			{!postsState.isLoading && (
				<div>
					<button
						onClick={() => {
							dispatch({ type: "FETCH_DATA" });
						}}
					>
						search
					</button>
					{postsState.posts.map(row => {
						return (
							<li key={row.id}>
								{row.userId} - {row.title}
							</li>
						);
					})}
				</div>
			)}
		</div>
	);
}
//

export default PostsWidget;
