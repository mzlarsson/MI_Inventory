
import sys
from PIL import Image, ImageDraw
from os import listdir
from os.path import isfile, join

# Create a new image with the given size
def create_image(i, j):
	image = Image.new("RGB", (i, j), "white")
	return image

# Open an Image
def open_image(path):
	newImage = Image.open(path)
	return newImage


# Save Image
def save_image(image, path):
	image.save(path, 'png')


# Limit maximum value to 255
def get_max(value):
	if value > 255:
		return 255

	return int(value)


# Get the pixel from the given image
def get_pixel(image, i, j):
	# Inside image bounds?
	width, height = image.size
	if i > width or j > height:
		return None

	# Get Pixel
	pixel = image.getpixel((i, j))
	return pixel
	
def convert(image, filter):
	# Get size
	width, height = image.size
	pixels = image.load()

	# Convert each pixel to sepia
	for i in range(0, width, 1):
		for j in range(0, height, 1):
			p = get_pixel(image, i, j)
			pixels[i, j] = filter(p[0], p[1], p[2], p[3])

	# Return new image
	return image
	
# Sepia is a filter based on exagerating red, yellow and brown tones
# This implementation exagerates mainly yellow with a little brown
def nice_filter(red, green, blue, alpha):
	# This is a really popular implementation
	tRed = get_max((0.900 * red) + (0.600 * green) + (0.400 * blue))
	tGreen = get_max((0.676 * red) + (0.354 * green) + (0.173 * blue))
	tBlue = get_max((0.524 * red) + (0.277 * green) + (0.136 * blue))

	# Return sepia color
	return tRed, tGreen, tBlue, alpha
	
def convert_file(path_in, path_out):
	if (path_in == path_out):
		print("Same input as output. Skipping.")
		return
	
	print("Converting " + path_in + "...")
	image = open_image(path_in)
	new_image = convert(image, nice_filter)
	save_image(new_image, path_out)

	
def main():
	path = "."
	files = [f for f in listdir(path) if isfile(join(path, f)) and f.endswith('.png')]
	for file in files:
		try:
			convert_file(join(path, file), join("..", "items", file))
		except Exception as e:
			print(e)


if __name__ == "__main__":
	main()