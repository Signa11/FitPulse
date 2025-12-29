import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]"
        >
            {/* Food Image */}
            <div className="relative h-32">
                <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                />
                {/* Prep Time Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                    <Clock className="w-3 h-3 text-slate-600" />
                    <span className="text-xs font-medium text-slate-700">{recipe.prepTime} min</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3">
                <h3 className="font-semibold text-sm text-slate-800 line-clamp-2">{recipe.title}</h3>

                {/* Macro Pills */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 bg-[#7BC143]/15 text-[#5FA030] rounded-full text-xs font-medium">
                        {recipe.protein}g protein
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        {recipe.calories} kcal
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;
