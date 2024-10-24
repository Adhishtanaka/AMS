import  { useState, useEffect } from 'react';

interface AnimatedCountdownProps {
    endDate: string; 
  }

  const AnimatedCountdown: React.FC<AnimatedCountdownProps> = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    isActive: false
  });
  
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const total = end - now;
      
      if (total <= 0) {
        return { days: 0, hours: 0, minutes: 0, isActive: false };
      }

      return {
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((total % (1000 * 60 * 60)) / (1000 * 60)),
        isActive: true
      };
    };

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      if (JSON.stringify(newTime) !== JSON.stringify(timeLeft)) {
        setTimeLeft(newTime);
        setAnimate(true);
        setTimeout(() => setAnimate(false), 1000);
      }
    }, 60000); 


    setTimeLeft(calculateTimeLeft());
    
    return () => clearInterval(timer);
  }, [endDate, timeLeft]);

  if (!timeLeft.isActive) {
    return (
      <div>
        <p className="text-gray-500 text-xs sm:text-sm">Time Remaining</p>
        <p className="text-sm sm:text-base text-red-600">
          Auction Ended
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-500 text-lg sm:text-sm">Time Remaining</p>
      <div className="flex gap-1 items-baseline">
        <div className={`inline-flex items-center ${animate ? 'animate-pulse' : ''}`}>
          <span className="text-sm sm:text-base font-semibold text-gray-800">
            {timeLeft.days}
          </span>
          <span className="text-lg text-gray-600 ml-1">d</span>
        </div>
        <div className={`inline-flex items-center ${animate ? 'animate-pulse' : ''}`}>
          <span className="text-sm sm:text-base font-semibold text-gray-800">
            {timeLeft.hours}
          </span>
          <span className="text-lg text-gray-600 ml-1">h</span>
        </div>
        <div className={`inline-flex items-center ${animate ? 'animate-pulse' : ''}`}>
          <span className="text-sm sm:text-base font-semibold text-gray-800">
            {timeLeft.minutes}
          </span>
          <span className="text-lg text-gray-600 ml-1">m</span>
        </div>
       
      </div>
    </div>
  );
};

export default AnimatedCountdown;