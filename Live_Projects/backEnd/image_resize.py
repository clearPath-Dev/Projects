from PIL import Image

def resize_image(size1, size2) :
    image = Image.open('image-01.jpg')

    print(f"Current size : {image.size}" )

    resized_image = image.resize(( size1, size2))

    resized_image.save('image-01-' + str(size1) +  '.jpg')

    size1 = int(input('Enter Width: '))
    size2 = int(input('Enter Length: '))
    resize_image(size1, size2)
