const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white space-y-6">
      <div className="loading-wave">
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
        <div className="loading-bar"></div>
      </div>
    </div>
  );
};

export default Loader;
