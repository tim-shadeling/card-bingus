function randint(lower, upper) {
	console.log(lower,upper);
	return Math.floor(lower + Math.random()*(upper-lower))
}

export {randint};