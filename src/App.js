import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: 30,
      cols: 60,
      data: [],
      colorData: [],
      keepSou: false,
      keepDest: false,
      keepBlock: false,
      colorSou: "white",
      colorDest: "white",
      colorBlock: "white",
      colorDia: "white",
      colorEra: "white",
      source: "0 0",
      repeat: 4,
      isMouse: false,
    };
  }
  animate(data, prev, rr, cc) {
    for (let i = 0; i <= data.length; i++) {
      if (i === data.length) {
        setTimeout(() => {
          this.animatePath(prev, rr, cc);
        }, 20 * i + 3500);
        return;
      }
      setTimeout(() => {
        const lst = data[i];
        if (
          document.getElementById(`node-${lst[0]}-${lst[1]}`).className ===
          "cell"
        )
          document.getElementById(`node-${lst[0]}-${lst[1]}`).className =
            "cell animate";
      }, 20 * i);
    }
  }

  animatePath(prev, rr, cc) {
    let src = this.state.source;
    let ans = `${rr} ${cc}`;
    let arr = [];
    while (ans !== src) {
      let f = parseInt(ans.split(" ")[0]);
      let e = parseInt(ans.split(" ")[1]);
      ans = prev[f][e];
      arr.push(`node-${f}-${e}`);
    }
    for (let i = 0; i < arr.length; i++) {
      setTimeout(() => {
        if (document.getElementById(arr[i]).className === "cell animate")
          document.getElementById(arr[i]).className = "cell spath";
      }, 50 * i);
    }
  }

  componentDidMount() {
    let acdata = [];
    for (var i = 0; i < this.state.rows; i++) {
      let tmp = [];
      for (var j = 0; j < this.state.cols; j++) {
        tmp.push(0);
      }
      acdata.push(tmp);
    }

    let s = new Map();
    s[1] = "grey";
    s[-1] = "red";
    s[0] = "white";
    let data = [];
    acdata.forEach((lst) => {
      let tmp = [];
      lst.forEach((e) => {
        tmp.push(s[e]);
      });
      data.push(tmp);
    });
    this.setState({
      colorData: data,
      data: acdata,
    });
  }

  BFSSearch(arr) {
    var rows = this.state.rows;
    var cols = this.state.cols;
    var rep = this.state.repeat;
    var src = this.state.source;
    var animation = [];
    var prev = [];
    var x = [];
    var y = [];
    let d1 = [1, 0, -1, 0, -1, -1, +1, +1];
    let d2 = [0, 1, 0, -1, +1, -1, -1, +1];
    var visited = [];
    for (var i = 0; i < rows; i++) {
      var tmp = [];
      for (var j = 0; j < cols; j++) {
        tmp.push(0);
      }
      visited.push(tmp);
    }
    for (i = 0; i < rows; i++) {
      tmp = [];
      for (j = 0; j < cols; j++) {
        tmp.push(src);
      }
      prev.push(tmp);
    }
    x.push(parseInt(src.split(" ")[0]));
    y.push(parseInt(src.split(" ")[1]));
    var layers = 1;
    var nodes = 0;
    var found = 0;
    while (found === 0 && x.length > 0) {
      var r = x.shift();
      var c = y.shift();
      for (i = 0; i < rep; i++) {
        var rr = r + d1[i];
        var cc = c + d2[i];
        if (rr < 0 || rr >= rows) continue;
        if (cc < 0 || cc >= cols) continue;
        if (visited[rr][cc] === 1) continue;
        if (arr[rr][cc] === 1) continue;
        visited[rr][cc] = 1;
        animation.push([rr, cc]);
        x.push(rr);
        y.push(cc);
        prev[rr][cc] = `${r} ${c}`;
        nodes++;
        if (arr[rr][cc] === -1) {
          found = 1;
          // var acdata = this.state.data;
          // let s = new Map();
          // s[1] = "grey";
          // s[-1] = "red";
          // s[0] = "white";
          // let up = [];
          // acdata.forEach((lst) => {
          //   let tmp = [];
          //   lst.forEach((e) => {
          //     tmp.push(s[e]);
          //   });
          //   up.push(tmp);
          // });
          // up[parseInt(this.state.source.split(" ")[0])][
          //   parseInt(this.state.source.split(" ")[1])
          // ] = "blue";
          // this.setState({
          //   path: prev,
          //   animate: animation,
          //   ans: "",
          // });
          console.log("found");
          this.animate(animation, prev, rr, cc);
          break;
        }
      }
      layers--;
      if (layers === 0) {
        layers = nodes;
        nodes = 0;
      }
    }
  }

  render() {
    return (
      <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "4vh",
            justifyContent: "space-around",
            paddingTop: "1vh",
            paddingBottom: "1vh",
            borderBottom: "1px solid grey",
          }}
        >
          <div
            style={{
              cursor: "pointer",
              border: "1px solid grey",
              paddingRight: "10px",
              paddingLeft: "10px",
              borderRadius: "5px",
            }}
            onClick={() => {
              for(let i=0;i<this.state.rows;i++){
                for(let j=0;j<this.state.cols;j++){
                  if(document.getElementById(`node-${i}-${j}`).className === "cell animate" || document.getElementById(`node-${i}-${j}`).className === "cell spath"){
                    document.getElementById(`node-${i}-${j}`).className = "cell"
                  }
                }
              }

              this.BFSSearch(this.state.data);
            }}
          >
            Start
          </div>
          <div
            style={{
              cursor: "pointer",
              border: "1px solid grey",
              backgroundColor: this.state.colorSou,
              paddingRight: "10px",
              paddingLeft: "10px",
              borderRadius: "5px",
            }}
            onClick={() => {
              this.setState({
                keepSou: true,
                keepDest: false,
                keepBlock: false,
                erase: false,
                colorBlock: "white",
                colorSou: "yellow",
                colorDest: "white",
                colorEra: "white",
              });
            }}
          >
            Keep Source
          </div>
          <div
            style={{
              cursor: "pointer",
              border: "1px solid grey",
              backgroundColor: this.state.colorDest,
              paddingRight: "10px",
              paddingLeft: "10px",
              borderRadius: "5px",
            }}
            onClick={() => {
              this.setState({
                keepSou: false,
                keepDest: true,
                keepBlock: false,
                erase: false,
                colorBlock: "white",
                colorSou: "white",
                colorDest: "yellow",
                colorEra: "white",
              });
            }}
          >
            Keep Destiation
          </div>
          <div
            style={{
              cursor: "pointer",
              border: "1px solid grey",
              backgroundColor: this.state.colorBlock,
              paddingRight: "10px",
              paddingLeft: "10px",
              borderRadius: "5px",
            }}
            onClick={() => {
              this.setState({
                keepSou: false,
                keepDest: false,
                keepBlock: true,
                erase: false,
                colorBlock: "yellow",
                colorSou: "white",
                colorDest: "white",
                colorEra: "white",
              });
            }}
          >
            Keep Blocks
          </div>
          <div
            style={{
              cursor: "pointer",
              border: "1px solid grey",
              backgroundColor: this.state.colorDia,
              paddingRight: "10px",
              paddingLeft: "10px",
              borderRadius: "5px",
            }}
            onClick={() => {
              var rep = this.state.repeat;
              if (rep === 4) {
                this.setState({
                  repeat: 8,
                  colorDia: "yellow",
                });
              } else {
                this.setState({
                  repeat: 4,
                  colorDia: "white",
                });
              }
            }}
          >
            Enable Diagonal
          </div>
          <div
            style={{
              cursor: "pointer",
              border: "1px solid grey",
              paddingRight: "10px",
              paddingLeft: "10px",
              borderRadius: "5px",
            }}
            onClick={() => {
              let acdata = [];
              for (var i = 0; i < this.state.rows; i++) {
                let tmp = [];
                for (var j = 0; j < this.state.cols; j++) {
                  tmp.push(0);
                  document.getElementById(`node-${i}-${j}`).className = "cell";
                }
                acdata.push(tmp);
              }
              this.setState({
                data: acdata,
              });
            }}
          >
            Reset
          </div>
          <div
            style={{
              cursor: "pointer",
              border: "1px solid grey",
              backgroundColor: this.state.colorEra,
              paddingRight: "10px",
              paddingLeft: "10px",
              borderRadius: "5px",
            }}
            onClick={() => {
              this.setState({
                keepSou: false,
                keepDest: false,
                keepBlock: false,
                erase: true,
                colorBlock: "white",
                colorSou: "white",
                colorDest: "white",
                colorEra: "yellow",
              });
            }}
          >
            Erase
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {this.state.colorData.map((cdata, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "row" }}>
              {cdata.map(
                (color, j) => (
                  <div
                    id={`node-${i}-${j}`}
                    key={`node-${i}-${j}`}
                    onClick={() => {
                      console.log(`node-${i}-${j}`);
                      if (this.state.keepBlock) {
                        let lst = this.state.data;
                        lst[i][j] = 1;
                        this.setState({
                          data: lst,
                        });

                        document.getElementById(`node-${i}-${j}`).className =
                          "cell block";
                      } else if (this.state.keepDest) {
                        let lst = this.state.data;
                        lst[i][j] = -1;
                        this.setState({
                          data: lst,
                        });
                        document.getElementById(`node-${i}-${j}`).className =
                          "cell destination";
                      } else if (this.state.keepSou) {
                        document.getElementById(`node-${this.state.source.split(" ")[0]}-${this.state.source.split(" ")[1]}`).className =
                          "cell";
                        this.setState({
                          source: `${i} ${j}`,
                        });
                        document.getElementById(`node-${i}-${j}`).className =
                          "cell source";
                      } else if (this.state.erase) {
                        var f1 = this.state.data;
                        f1[i][j] = 0;
                        this.setState({
                          data: f1,
                        });
                        document.getElementById(`node-${i}-${j}`).className =
                          "cell";
                      }
                    }}
                    className="cell"
                    onMouseDown={() => {
                      this.setState({
                        isMouse: true,
                      });
                    }}
                    onMouseUp={() => {
                      let arr = this.state.data;
                      for(let i=0;i<this.state.rows;i++){
                        for(let j=0;j<this.state.cols;j++){
                          if(document.getElementById(`node-${i}-${j}`).className === "cell block"){
                            arr[i][j] = 1;
                          }
                        }
                      }
                      this.setState({
                        isMouse: false,
                        data: arr
                      });
                    }}
                    onMouseEnter={() => {
                      if (this.state.isMouse && this.state.keepBlock) {
                        // let lst = this.state.data;
                        // lst[i][j] = 1;
                        // console.log(lst);
                        // this.setState({
                        //   data: lst,
                        // });
                        document.getElementById(`node-${i}-${j}`).className =
                          "cell block";
                      }
                    }}
                  ></div>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
