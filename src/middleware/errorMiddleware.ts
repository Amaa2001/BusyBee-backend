module.exports = (err: Error, req: any, res: any, next: any) => {
 res.status(500).json({
   message: err.message
 });
};

// den fångar fel som skickas med next(err) i controller och skickar tillbaka 500 status med fel medelandet i JSON format.
// Genom att använda denna middleware i server.ts
