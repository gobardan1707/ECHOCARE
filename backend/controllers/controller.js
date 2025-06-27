
export const getMessage = (req, res) => {
  res.json({ 
    message: 'EchoCare Backend API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
};

export default {
  getMessage
};
