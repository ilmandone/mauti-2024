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
  
  vec4 finalTexture = texture2D(uTexture, UVCoords - 0.02 * deform.rg);
  float lightIntensity = abs(deform.r) * 0.035;
  vec4 finalColorAdded = vec4(finalTexture.r + lightIntensity, finalTexture.g + lightIntensity, finalTexture.b + lightIntensity, 1);
  
  gl_FragColor = mix(finalTexture, finalColorAdded, deform.a);
    
}
`
