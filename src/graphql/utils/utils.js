export const paginateResults = ({ after: cursor, pageSize, results, getCursor = () => null }) => {

	console.log('ZZZZZZZZZZZZZZZZ > cursor??????????: ', cursor)

	if (pageSize < 1) return [];

	if (!cursor) return results.slice(0, pageSize);

	console.log('ZZZZZZZZZZZZZZZZ > cursor: ', cursor)

	const cursorIndex = results.findIndex(item => {
		let itemCursor = item.cursor ? item.cursor : getCursor(item);
		return itemCursor ? cursor === itemCursor : false;
	});

	console.log('ZZZZZZZZZZZZZZZZ > cursorIndex: ', cursorIndex)

	const cursorIndexXXX = cursorIndex >= 0
		? cursorIndex === results.length - 1
			? []
			: results.slice(
					cursorIndex + 1,
					Math.min(results.length, cursorIndex + 1 + pageSize),
				)
		: results.slice(0, pageSize);

	console.log('ZZZZZZZZZZZZZZZZ > cursorIndexXXX: ', cursorIndexXXX)

	return cursorIndexXXX;
};
