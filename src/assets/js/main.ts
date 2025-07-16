export const changeDataTableHeight = () => {
	setTimeout(() => {
		const id = document.getElementById('id-height')
			var height = window.innerHeight - 240
			document.getElementById("datatable").style.height = height + "px";
	}, 0)
}

export const changeDataTableHeightNotNavbar = () => {
	setTimeout(() => {
		const id = document.getElementById('id-height')
			var height = window.innerHeight - 180
			document.getElementById("datatable").style.height = height + "px";
	}, 0)
}