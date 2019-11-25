import React from 'react';

class WFCanvas extends React.Component{
    componentDidMount() {
        const wfcanv = this.refs.canvas
        const wfctx = canvas.getContext("2d")
    }
    render(){
        return(
            <div>
              <canvas ref="canvas" width={} height={} />
              
            </div>
          )
    }
}