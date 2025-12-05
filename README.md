# Web Dev Starter Code

## Project Spec

Open Recipe Cookbook

THEME/IDEA:
The general theme/idea for this project will be a Open Recipe Cookbook. In this cookbook, users will be able to view other's uploaded recipes based on categories or searched keywords. The website then will display all the recipe's that match, along with the recipes name, a picture demonstrating it, and its rating, The users then can click on individual recipes to view the ingredients, steps, more about it, notes, comments, more images, and its rating. The users will be able to add their own comments or likes as well. The users will also be able to add/upload their own recipes, choosing from their photos, adding their ingredients, name, notes, steps etc so others can view and follow along.


TARGET AUDIENCE:
The ideal target audience is for those who enjoy cooking or trying out new recipes. But this website will be able to be used by anyone who just wants to try a new recipe or upload thier own to see what others think about it. Whether this website is used for spreading custom recipes, or used as a last minute need a quick recipe type person, anyone can use it.

DATA:
This project will manage data that involves recipes. Each recipe will have titles, pictures, ingredients, steps, notes, likes, comments, etc. All of this will be stored on AWS and then dynamically generated based on the categories or tags searched for by the users and displayed for the users.

STRETCH GOALS:
After the project is fully completed and functional. A stretch goal is to add a saved recipe list. Or even a log in capability for reoccuring users who want to save their favorite recipes and find them quickly.

## Project Wireframe

HOME PAGE:
<img width="1179" height="635" alt="image" src="https://github.com/user-attachments/assets/369b7b65-64ed-49ed-b86f-8a26d1692714" />


VIEW RECIPE's PAGE
<img width="1044" height="851" alt="image" src="https://github.com/user-attachments/assets/8f63bb32-f606-41c6-8b58-24981cd21e77" />

INDIVIDUAL RECIPE PAGE:
<img width="974" height="845" alt="image" src="https://github.com/user-attachments/assets/851330e7-7791-4817-9ead-68c51630f6e9" />





## NOTES
Recipe Structure:

{
  "recipeId": "uuid-string",
  "name": "Spaghetti",
  "category": "dinner",
  "imageUrl": "https://example.com/spaghetti.jpg",
  "ingredients": ["1 lb pasta", "2 cups tomato sauce"],
  "steps": ["Boil water", "Cook pasta", "Add sauce"],
  "notes": "Family recipe",
  "likes": 0,
  "createdAt": "2025-03-01T00:00:00.000Z"
}


