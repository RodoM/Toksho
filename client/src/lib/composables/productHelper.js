import { reactive, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, requiredIf, alpha, maxValue, helpers } from "@vuelidate/validators";
import placeholderImage from "@/assets/images/image-placeholder.jpg";

export const initialState = reactive({
  id: "",
  type: "",
  name: "",
  image: {
    image: null,
    imageSmall: null,
    imageReader: placeholderImage,
    imageURL: "",
    imageSmallURL: "",
  },
  size: undefined,
  author: "",
  editorial: "",
  categories: "",
  price: "",
  discount: "0",
  description: "",
  stock: "",
});

const rules = computed(() => {
  return {
    type: {
      required: helpers.withMessage("Requerido", required),
      alpha: helpers.withMessage("Solo caracteres alfabeticos", alpha),
    },
    name: {
      required: helpers.withMessage("Requerido", required),
      noSlash: helpers.withMessage("No se permiten '/'", () => {
        return !initialState.name.includes("/");
      }),
    },
    image: {
      image: {
        required: helpers.withMessage(
          "Requerido",
          requiredIf(() => {
            return typeof initialState.image === "object";
          })
        ),
      },
    },
    size: {
      required: helpers.withMessage("Requerido", required),
    },
    author: {
      required: helpers.withMessage("Requerido", required),
      noSlash: helpers.withMessage("No se permiten '/'", () => {
        return !initialState.author.includes("/");
      }),
    },
    editorial: {
      required: helpers.withMessage("Requerido", required),
    },
    categories: {
      required: helpers.withMessage("Requerido", required),
    },
    price: {
      required: helpers.withMessage("Requerido", required),
    },
    description: {
      required: helpers.withMessage("Requerido", required),
    },
    discount: {
      maxValue: helpers.withMessage("Máximo 99% de descuento", maxValue(99)),
    },
    stock: {
      required: helpers.withMessage("Requerido", required),
    },
  };
});

export const v$ = useVuelidate(rules, initialState);

export const resetForm = () => {
  resetInitialState();
  v$.value.$reset();
};

const resetInitialState = () => {
  Object.assign(initialState, {
    id: "",
    type: "",
    name: "",
    image: {
      image: null,
      imageSmall: null,
      imageReader: "/src/assets/images/image-placeholder.jpg",
      imageURL: "",
      imageSmallURL: "",
    },
    size: undefined,
    author: "",
    editorial: "",
    categories: "",
    price: "",
    discount: "0",
    description: "",
    stock: "",
  });
};

export const formatName = (input) => {
  const words = input.trim().split(/\s+/);
  const formattedName = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return formattedName.join(" ");
};

export const formatAuthors = (input) => {
  const authors = input.split(", ");
  const formattedAuthors = authors.map((name) => {
    const words = name.trim().split(/\s+/);
    const capitalizedWords = words.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return capitalizedWords.join(" ");
  });
  return formattedAuthors.join(", ");
};
