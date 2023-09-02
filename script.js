const categorieBtn = document.getElementById("catagory-btn");
const noMedia = document.getElementById("no-data");
const handleCategories = async () => {
  try {
    const response = await fetch(
      "https://openapi.programming-hero.com/api/videos/categories"
    );
    const data = await response.json();
    // console.log(data);

    data?.data?.forEach((element) => {
      const category = element.category;
      // console.log(category);
      const categoryTab = document.createElement("a");
      categoryTab.classList =
        "text-sm font-medium px-2 py-2 rounded-lg cursor-pointer bg-gray-100 mt-5";
      categoryTab.setAttribute("key", element.category_id);
      // active
      categoryTab.innerHTML = `${category}`;

      if (element.category_id == "1000") {
        categoryTab.classList.add("active");
        handelCategoryLoad(element.category_id);
      }

      categoryTab.addEventListener("click", () => {
        const tabs = categorieBtn.querySelectorAll("a");
        // console.log(tabs)
        tabs.forEach((item) => {
          item.classList.remove("active");
        });
        categoryTab.classList.add("active");
        handelCategoryLoad(element.category_id);
      });

      categorieBtn.appendChild(categoryTab);
    });
    // console.log(data.data);
  } catch (error) {
    console.error("An error found:", error);
  }
};

const cardContainer = document.getElementById("card-container");

const handelCategoryLoad = async (id, isSortByViews) => {
  cardContainer.innerHTML = "";

  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/videos/category/${id}`
    );
    const data = await response.json();
    // console.log(data);
    const posts = await data.data;
    let mediaReceieved = [...posts];
    // sort by views
    if (isSortByViews) {
      mediaReceieved.sort(
        (a, b) =>
          b.others?.views.slice(0, b.others.views.indexOf("K")) -
          a.others?.views.slice(0, a.others.views.indexOf("K"))
      );
    }
    // function showAllPost(posts, isSortByViews) {
    //   let updatePost = [...posts];
    //   if (isSortByViews) {
    //     updatePost = posts.sort(function (post1, post2) {
    //       console.log(post1)
    //     });
    //   }
    // }
    // add media
    if (mediaReceieved.length > 0) {
      noMedia.classList.add("hidden");
      mediaReceieved?.forEach((blog) => {
        // console.log(blog);
        const div = document.createElement("div");
        div.classList.add(
          "relative",
          "mb-10",
          "mx-2",
          "shadow-xl",
          "rounded-xl",
          "pb-2"
        );

        div.innerHTML = `
      <div class='relative'>
      <img src=${blog.thumbnail} alt="" class="w-full h-[250px] rounded-xl" />
      <div class="absolute right-3 bottom-6 rounded">
      ${
        blog.others?.posted_date
          ? `<p class="bg-black text-white/75 px-4 text-[10px] py-1"> ${getPostesTime(
              blog.others.posted_date
            )} </p>`
          : ""
      }
      </div>
        </div>
          <div class="flex gap-5 items-start mt-5 px-2">
          <img src="${
            blog?.authors[0]?.profile_picture
          }" alt="" class="rounded-full w-[60px] h-[60px]">
            <div class="flex flex-col gap-2">
              <h2 class="text-xl font-bold line-clamp-2">
                ${blog?.title}
              </h2>
              <div class="flex gap-3 items-center">
                <p>${blog?.authors[0]?.profile_name}</p>
               
                <div>${
                  blog.authors[0]?.verified
                    ? `<img src="img/verified.png" alt="">`
                    : ""
                }</div>
              </div>
              <p>${blog?.others?.views} <span>views</span></p>
            </div>
          </div>
      `;
        cardContainer.appendChild(div);
      });
    } else {
      noMedia.classList.remove("hidden");
    }
  } catch (error) {
    console.error("An error found:", error);
  }
};

// get time

const getPostesTime = (seconds) => {
  let hour = "";
  let minute = "";
  const getMinute = Math.floor(seconds / 60);
  const getHour = Math.floor(getMinute / 60);
  minute = getMinute - getHour * 60;
  if (getHour <= 1) {
    hour = `${getHour}hr`;
  } else {
    hour = `${getHour}hrs`;
  }
  if (getMinute <= 1) {
    minute = minute + " min";
  } else {
    minute = minute + " mins";
  }
  return `${hour} ${minute} ago`;
};

// short by viewa
function handleSortByViewsClick() {
  console.log("sort by view clicked");
  const category = categorieBtn.querySelector(".active");
  console.log(category);
  const id = category.getAttribute("key");

  handelCategoryLoad(id, true);
}

handleCategories();
