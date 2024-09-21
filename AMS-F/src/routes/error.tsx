const Error: React.FC = () => {
  
    return (
    <>
    <div className="flex flex-col items-center justify-center w-screen h-screen">
        <h1 className="text-6xl font-bold text-black">404</h1>
        <h4 className="text-2xl">Page not found!</h4>
        <p>Please check the URL again.<a href="" className="text-sm text-green-700"> go to home page.</a></p>
    
    </div>
    </>
);
}

export default Error;