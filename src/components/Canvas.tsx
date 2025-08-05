


// import { useRef, useEffect } from 'react';
// import { useAppSelector, useAppDispatch } from '../redux/hooks'

// const dispatch = useAppDispatch();

// function makeYAxis(startValue: number, stopValue : number, cardinality : number) {
//   var arr = [];
//   var step = (stopValue - startValue) / (cardinality - 1);
//   for (var i = 0; i < cardinality; i++) {
//     arr.push(startValue + (step * i));
//   }
//   return arr;
// }

// function getDataPoints(){ //im going to pretend that I am setting the data retention limit based on sampling rate etc
//     const newData = useAppSelector((state) => state.data.newData);
//     //if (newData){ //right now only thinking about one sensor at a time
//     const data = useAppSelector((state) => state.data.data);
//     const xData = data[0].dataPoints.map(obj => obj.x)
//     const yData = data[0].dataPoints.map(obj => obj.y)
//     const zData = data[0].dataPoints.map(obj => obj.z)
//     dispatch(usedData())
//         //here is where I would trigger, I want to output the data exactly as I will display it on the screen

//     return ( [xData, yData, zData] )
//     //}
//    // else{
//         //cancel the re-render
//    // }


// }






// function Canvas() { 
// // props are passed in when its called in layout, 
// // setting the width and height there instead of here


//   const canvasRef = useRef<HTMLCanvasElement | null>(null); //this lets the canvas be a react component that can be interacted with

//   useEffect(() => {
//     if (canvasRef){
    
//     const canvas = canvasRef.current;
//     if (canvas){
//     const context = canvas.getContext('2d');
//     if (context){

        

//         //can use these calculated values to make the point's size based on size of screen
//     let requestId: number;
//     const render = () => {
//         //get data here
        
//         const dataPoints = getDataPoints()
//         const xDataPoints = dataPoints[0]
//         const yDataPoints = dataPoints[1]
//         const zDataPoints = dataPoints[2]

//         const step = makeYAxis(0 , canvas.width , xDataPoints.length)// it should be true that for any given render xyz should have the same amount of datapoints

//         context.fillStyle = "red"; //have one of this loop for each of xyz, each in a dif color
//         for (let i = 0; i < xDataPoints.length-1; i++) { //do this loop once for each datapoint
           
           
//             let x = xDataPoints[i] * canvas.height/4; //account for canvas size (need to think about exactly how)
//            //what you divide by is the top of your scale. so a 4 would be at the top of the canvas
//             let y = step[i];
//             context.beginPath();
//             context.ellipse(x, y, 2, 2, 0, 0, Math.PI * 2); 
//             //change these twos for something depending on the screensize 
//             context.fill();


//         }
         
//         requestId = requestAnimationFrame(render);

//        };
     
//     render(); //renders the canvas, calling the function that makes a new frame


//     return () => { //catches some rendering issues
//         cancelAnimationFrame(requestId);
//     };
//     }
//     }
//     }    
//     }, []);

//   return (<canvas ref={canvasRef} height={500} width={500} />);
// }
// export default Canvas;