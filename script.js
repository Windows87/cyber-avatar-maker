let cropper;

async function process() {
  let image = await IJS.Image.load(document.getElementById('original-image').src);
  let filter = await IJS.Image.load('https://i.imgur.com/abCjLgT.png');

  image = image.resize({ width: 1385, height: 1385  })

  for (let i = 0; i < image.width; i++) {
    for (let j = 0; j < image.height; j++) {
      let pixel = image.getPixel(i, j);
      let filterPixel = filter.getPixelXY(i, j);

      if (!(filterPixel[0] > 110 && filterPixel[1] < 110 && filterPixel[2] < 110)) {
        image = image.setPixelXY(i, j, filterPixel);
      }
    }
  }

  image = image.resize({ width: 1000, height: 1000  })

  document.getElementById('color').src = image.toDataURL();
  document.getElementById('download-image').style.display = 'block';

  document.querySelector('#generate-image').style.display = 'none';
  document.querySelector('#load-image').style.display = 'block';
  document.querySelector('#original-image-container').style.display = 'none';
  document.querySelector('#color').style.display = 'block';
  
  document.querySelector('#title').style.display = 'block';

  document.getElementById('download-image').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = image.toDataURL();
    a.download = 'semcomp-beta.png';
    a.click();
  })
}

document.querySelector('#load-image').addEventListener('click', () => {
  document.querySelector('#input-file').click();
})

document.querySelector('#input-file').addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    document.querySelector('#original-image-container').innerHTML = `
      <img id="original-image" src="${e.target.result}" />
    `;

    const image = document.querySelector('#original-image')
    cropper = new Cropper(image, {
      aspectRatio: 1
    })

    document.querySelector('#title').style.display = 'none';
    document.querySelector('#original-image-container').style.display = 'block';
    document.querySelector('#load-image').style.display = 'none';
    document.querySelector('#generate-image').style.display = 'block';
    document.querySelector('#download-image').style.display = 'none';
    document.querySelector('#color').style.display = 'none';
  }

  reader.readAsDataURL(file);
})

document.querySelector('#generate-image').addEventListener('click', () => {
  cropper.getCroppedCanvas().toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    document.querySelector('#original-image-container').innerHTML = `
      <img id="original-image" src="${url}" />
    `;

    process();
  })

  process();
})