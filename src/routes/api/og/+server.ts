// import { ImageResponse } from '@vercel/og';
// // import NotoSansMono from './NotoSansMono.ttf';

// export const config = {
//   runtime: 'edge',
// };

// const template = `
// <div
//   style={{
//     width: '100%',
//     height: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: 128,
//     background: 'lavender',
//   }}
//   >
//   Hello!
// </div>
// `;

// // const fontFile = await fetch('https://og-playground.vercel.app/inter-latin-ext-400-normal.woff');
// // const fontData: ArrayBuffer = await fontFile.arrayBuffer();

// export async function GET({ url, fetch }) {
//   // const title = url.searchParams.get('title');

//   // const font = await fetch(Overpass).then(res => res.arrayBuffer());
//   return new ImageResponse(template)
// }
