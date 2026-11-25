window.Animations={
  init:function(){
    try{this.canvas();}catch(e){console.error('canvas:',e);}
    try{this.tools();}catch(e){console.error('tools:',e);}
  },
  canvas:function(){
    var c=document.getElementById('particleCanvas');
    if(!c)return;
    var ctx=c.getContext('2d');
    function rz(){c.width=window.innerWidth;c.height=window.innerHeight;}
    rz();window.addEventListener('resize',rz);
    var P=[];for(var i=0;i<45;i++)P.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,r:Math.random()*2+1});
    (function draw(){ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='rgba(59,130,246,.4)';P.forEach(function(p){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>c.width)p.vx*=-1;if(p.y<0||p.y>c.height)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();});requestAnimationFrame(draw);})();
  },
  tools:function(){
    setInterval(function(){var w=document.getElementById('wrench');if(w)w.style.transform='translate('+((Math.random()-.5)*150)+'px,'+((Math.random()-.5)*100)+'px) rotate('+((Math.random()-.5)*20)+'deg)';},4000);
    setInterval(function(){var o=document.getElementById('oilCan');if(o)o.style.transform='translate('+((Math.random()-.5)*120)+'px,'+((Math.random()-.5)*80)+'px) rotate('+((Math.random()-.5)*25)+'deg)';},5000);
  }
};
