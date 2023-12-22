export const fragment = `
uniform float time;
uniform float progress;
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;


uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI = 3.141592653589793238;
void main()	{

  vec2 UVCoords = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);  
  vec4 color = texture2D(uTexture,UVCoords);
  vec4 deform = texture2D(uDataTexture, vUv);
  
  gl_FragColor = texture2D(uTexture, UVCoords - 0.02 * deform.rg);
  
}
`

// FIRST STEP
// gl_FragColor = texture2D(uTexture, (vUv - vec2(0.5)) * resolution.zw + vec2(0.5));

// TEST FOR DISTORTION
// gl_FragColor = vec4(deform.r,0.,0.,1.);
/*vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
    vec4 color = texture2D(uTexture,newUV);
    vec4 offset = texture2D(uDataTexture,vUv);
    gl_FragColor = vec4(vUv,0.0,1.);
    gl_FragColor = vec4(offset.r,0.,0.,1.);
    gl_FragColor = color;
    gl_FragColor = texture2D(uTexture,newUV - 0.02*offset.rg);*/
