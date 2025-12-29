// =====================================================
// FitPulse - Comprehensive 15-Minute Workout Programs
// Each workout has structured exercises with video guides
// =====================================================

export const workoutPrograms = [
    // =====================================================
    // HIIT WORKOUTS
    // =====================================================
    {
        id: 1,
        title: 'Morning Energy Blast',
        instructor: 'Sarah Johnson',
        category: 'hiit',
        duration: 15,
        intensity: 'High',
        intensityEmoji: '🔥🔥',
        thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
        equipment: ['None'],
        description: 'Start your day with this high-energy HIIT workout designed to boost your metabolism and energize your body. Perfect for burning calories in a short time.',
        calories: 180,
        difficulty: 'Intermediate',
        exercises: [
            {
                name: 'Jumping Jacks',
                duration: 45,
                type: 'exercise',
                description: 'Start with feet together, arms at sides. Jump feet apart while raising arms overhead. Return to start.',
                videoUrl: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8',
                targetMuscles: ['Full Body', 'Cardio'],
                tips: ['Keep core tight', 'Land softly on balls of feet']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'High Knees',
                duration: 45,
                type: 'exercise',
                description: 'Run in place, driving knees up toward chest as high as possible. Pump arms for momentum.',
                videoUrl: 'https://www.youtube.com/watch?v=D0bp46XOouA',
                targetMuscles: ['Core', 'Legs', 'Cardio'],
                tips: ['Keep back straight', 'Land on balls of feet']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Burpees',
                duration: 45,
                type: 'exercise',
                description: 'From standing, squat down, place hands on floor, jump feet back to plank, do a push-up, jump feet forward, and explosively jump up.',
                videoUrl: 'https://www.youtube.com/watch?v=JZQA08SlJnM',
                targetMuscles: ['Full Body', 'Core', 'Cardio'],
                tips: ['Modify by stepping instead of jumping', 'Keep core engaged throughout']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Mountain Climbers',
                duration: 45,
                type: 'exercise',
                description: 'Start in plank position. Rapidly alternate driving knees toward chest, like running in place horizontally.',
                videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
                targetMuscles: ['Core', 'Shoulders', 'Cardio'],
                tips: ['Keep hips low', 'Maintain steady breathing']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Squat Jumps',
                duration: 45,
                type: 'exercise',
                description: 'Perform a squat, then explosively jump up, reaching arms overhead. Land softly and immediately go into next rep.',
                videoUrl: 'https://www.youtube.com/watch?v=CVaEhXotL7M',
                targetMuscles: ['Quads', 'Glutes', 'Calves'],
                tips: ['Land with soft knees', 'Keep chest up during squat']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Plank Jacks',
                duration: 40,
                type: 'exercise',
                description: 'Start in plank position. Jump feet out wide, then back together, like a horizontal jumping jack.',
                videoUrl: 'https://www.youtube.com/watch?v=fBVVFXdUPpQ',
                targetMuscles: ['Core', 'Shoulders', 'Cardio'],
                tips: ['Keep core tight', 'Dont let hips sag']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Speed Skaters',
                duration: 45,
                type: 'exercise',
                description: 'Leap laterally from one foot to the other, swinging arms across body. Touch the floor with opposite hand.',
                videoUrl: 'https://www.youtube.com/watch?v=d3IAS0CNoG0',
                targetMuscles: ['Glutes', 'Quads', 'Core'],
                tips: ['Stay low', 'Control your landing']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Tuck Jumps',
                duration: 40,
                type: 'exercise',
                description: 'Jump up and tuck both knees toward chest at peak of jump. Land softly and repeat.',
                videoUrl: 'https://www.youtube.com/watch?v=vj7I11f0I_s',
                targetMuscles: ['Core', 'Legs', 'Cardio'],
                tips: ['Use arms for momentum', 'Land with bent knees']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Push-Up to Shoulder Tap',
                duration: 45,
                type: 'exercise',
                description: 'Perform a push-up, then at the top, tap right hand to left shoulder, then left hand to right shoulder.',
                videoUrl: 'https://www.youtube.com/watch?v=TEVhME_M8ec',
                targetMuscles: ['Chest', 'Core', 'Shoulders'],
                tips: ['Keep hips stable during taps', 'Widen feet for better balance']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Bicycle Crunches',
                duration: 45,
                type: 'exercise',
                description: 'Lie on back, hands behind head. Alternate bringing opposite elbow to opposite knee in a pedaling motion.',
                videoUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8',
                targetMuscles: ['Core', 'Obliques'],
                tips: ['Dont pull on neck', 'Control the movement']
            },
            { name: 'Cool Down Stretch', duration: 60, type: 'cooldown' }
        ]
    },
    {
        id: 2,
        title: 'Fat Burning Express',
        instructor: 'Mike Torres',
        category: 'hiit',
        duration: 15,
        intensity: 'High',
        intensityEmoji: '🔥🔥🔥',
        thumbnail: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop',
        equipment: ['None'],
        description: 'Maximum calorie burn in minimum time. This intense workout alternates between explosive movements and active recovery.',
        calories: 200,
        difficulty: 'Advanced',
        exercises: [
            {
                name: 'Butt Kicks',
                duration: 40,
                type: 'exercise',
                description: 'Run in place, kicking heels up toward glutes with each step. Keep a fast pace.',
                videoUrl: 'https://www.youtube.com/watch?v=_1_etWfHJjA',
                targetMuscles: ['Hamstrings', 'Cardio'],
                tips: ['Stay on balls of feet', 'Keep arms pumping']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Jump Lunges',
                duration: 40,
                type: 'exercise',
                description: 'Start in lunge position. Jump explosively and switch legs mid-air, landing in opposite lunge.',
                videoUrl: 'https://www.youtube.com/watch?v=y7Iug7eC0dk',
                targetMuscles: ['Quads', 'Glutes', 'Calves'],
                tips: ['Keep chest up', 'Land softly with control']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Lateral Shuffles',
                duration: 45,
                type: 'exercise',
                description: 'Stay low in athletic stance. Shuffle quickly side to side, touching the ground at each end.',
                videoUrl: 'https://www.youtube.com/watch?v=F9lEqJUALpI',
                targetMuscles: ['Quads', 'Glutes', 'Agility'],
                tips: ['Stay low', 'Push off with outside foot']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Plank to Push-Up',
                duration: 45,
                type: 'exercise',
                description: 'Start in forearm plank. Push up to high plank one arm at a time, then lower back down. Alternate leading arm.',
                videoUrl: 'https://www.youtube.com/watch?v=L4oFJRDAU4Q',
                targetMuscles: ['Core', 'Arms', 'Chest'],
                tips: ['Minimize hip rotation', 'Keep core tight']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Star Jumps',
                duration: 40,
                type: 'exercise',
                description: 'From squat position, explosively jump up, spreading arms and legs out like a star, then return to squat.',
                videoUrl: 'https://www.youtube.com/watch?v=0mfSfLIPl3M',
                targetMuscles: ['Full Body', 'Cardio'],
                tips: ['Explode from the squat', 'Land softly']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Russian Twists',
                duration: 45,
                type: 'exercise',
                description: 'Sit with knees bent, lean back slightly. Rotate torso side to side, optionally holding hands together.',
                videoUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI',
                targetMuscles: ['Obliques', 'Core'],
                tips: ['Keep chest lifted', 'Move with control']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Box Jumps (Invisible)',
                duration: 40,
                type: 'exercise',
                description: 'Perform jump squats with extra height, imagining jumping onto a box. Focus on explosive power.',
                videoUrl: 'https://www.youtube.com/watch?v=NBY9-kTuHEk',
                targetMuscles: ['Quads', 'Glutes', 'Power'],
                tips: ['Swing arms for momentum', 'Land softly']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Sprawls',
                duration: 40,
                type: 'exercise',
                description: 'Like a burpee but kick legs back wide, drop hips to floor briefly, then pop back up to standing.',
                videoUrl: 'https://www.youtube.com/watch?v=x_xSq5Lsrv4',
                targetMuscles: ['Full Body', 'Core'],
                tips: ['Move quickly', 'Control the drop']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Flutter Kicks',
                duration: 45,
                type: 'exercise',
                description: 'Lie on back, hands under hips. Raise legs slightly and alternate kicking up and down with straight legs.',
                videoUrl: 'https://www.youtube.com/watch?v=ANVdMDaYRts',
                targetMuscles: ['Lower Abs', 'Hip Flexors'],
                tips: ['Keep lower back pressed down', 'Small controlled kicks']
            },
            { name: 'Cool Down Stretch', duration: 60, type: 'cooldown' }
        ]
    },

    // =====================================================
    // STRENGTH WORKOUTS
    // =====================================================
    {
        id: 3,
        title: 'Full Body Strength',
        instructor: 'James Wilson',
        category: 'strength',
        duration: 15,
        intensity: 'Medium',
        intensityEmoji: '💪💪',
        thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
        equipment: ['None'],
        description: 'Build lean muscle with this bodyweight strength routine. Focuses on all major muscle groups using only your body weight.',
        calories: 150,
        difficulty: 'Intermediate',
        exercises: [
            {
                name: 'Bodyweight Squats',
                duration: 50,
                type: 'exercise',
                description: 'Stand with feet shoulder-width apart. Lower hips back and down until thighs are parallel to floor, then stand.',
                videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
                targetMuscles: ['Quads', 'Glutes', 'Hamstrings'],
                tips: ['Keep weight in heels', 'Dont let knees cave in']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Push-Ups',
                duration: 50,
                type: 'exercise',
                description: 'Start in high plank. Lower chest to floor keeping elbows at 45 degrees, then push back up.',
                videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
                targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
                tips: ['Keep body in straight line', 'Go to knees if needed']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Reverse Lunges',
                duration: 50,
                type: 'exercise',
                description: 'Step one foot back, lower until both knees are at 90 degrees, then push back to standing. Alternate legs.',
                videoUrl: 'https://www.youtube.com/watch?v=xrPteyQLGAo',
                targetMuscles: ['Quads', 'Glutes', 'Balance'],
                tips: ['Keep front knee over ankle', 'Step back far enough']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Diamond Push-Ups',
                duration: 45,
                type: 'exercise',
                description: 'Push-up with hands close together, forming a diamond shape with thumbs and index fingers. Great for triceps.',
                videoUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
                targetMuscles: ['Triceps', 'Chest', 'Shoulders'],
                tips: ['Keep elbows close to body', 'Modify on knees if needed']
            },
            { name: 'Rest', duration: 25, type: 'rest' },
            {
                name: 'Glute Bridges',
                duration: 50,
                type: 'exercise',
                description: 'Lie on back, knees bent, feet flat. Drive hips up by squeezing glutes, hold briefly, then lower.',
                videoUrl: 'https://www.youtube.com/watch?v=8bbE64NuDTU',
                targetMuscles: ['Glutes', 'Hamstrings', 'Core'],
                tips: ['Squeeze glutes at top', 'Dont hyperextend back']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Pike Push-Ups',
                duration: 45,
                type: 'exercise',
                description: 'Start in downward dog position. Bend elbows to lower head toward floor, then press back up. Targets shoulders.',
                videoUrl: 'https://www.youtube.com/watch?v=sposDXWEB0A',
                targetMuscles: ['Shoulders', 'Triceps'],
                tips: ['Keep hips high', 'Look at feet as you lower']
            },
            { name: 'Rest', duration: 25, type: 'rest' },
            {
                name: 'Sumo Squats',
                duration: 50,
                type: 'exercise',
                description: 'Wide stance with toes pointed out. Lower down keeping knees tracking over toes, squeeze inner thighs to stand.',
                videoUrl: 'https://www.youtube.com/watch?v=9ZuXKqRbT9k',
                targetMuscles: ['Inner Thighs', 'Glutes', 'Quads'],
                tips: ['Keep chest up', 'Press knees out']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Plank Hold',
                duration: 45,
                type: 'exercise',
                description: 'Hold high plank or forearm plank position, keeping body in straight line from head to heels.',
                videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
                targetMuscles: ['Core', 'Shoulders', 'Back'],
                tips: ['Dont let hips sag or pike', 'Breathe steadily']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Superman Hold',
                duration: 40,
                type: 'exercise',
                description: 'Lie face down. Simultaneously lift arms and legs off floor, squeezing back muscles. Hold or pulse.',
                videoUrl: 'https://www.youtube.com/watch?v=z6PJMT2y8GQ',
                targetMuscles: ['Lower Back', 'Glutes', 'Shoulders'],
                tips: ['Lift chest and thighs', 'Keep neck neutral']
            },
            { name: 'Cool Down Stretch', duration: 60, type: 'cooldown' }
        ]
    },
    {
        id: 4,
        title: 'Core Crusher',
        instructor: 'Sarah Johnson',
        category: 'strength',
        duration: 15,
        intensity: 'High',
        intensityEmoji: '🔥',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        equipment: ['Mat'],
        description: 'Intense core-focused workout targeting abs, obliques, and lower back. Build a strong and stable midsection.',
        calories: 130,
        difficulty: 'Intermediate',
        exercises: [
            {
                name: 'Dead Bug',
                duration: 50,
                type: 'exercise',
                description: 'Lie on back, arms up, knees at 90 degrees. Slowly lower opposite arm and leg while keeping lower back pressed down.',
                videoUrl: 'https://www.youtube.com/watch?v=I5xbsA71v1A',
                targetMuscles: ['Core', 'Hip Flexors'],
                tips: ['Keep lower back flat', 'Move slowly with control']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Plank',
                duration: 45,
                type: 'exercise',
                description: 'Hold forearm or high plank position, maintaining straight line from head to heels.',
                videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
                targetMuscles: ['Core', 'Shoulders'],
                tips: ['Engage glutes', 'Breathe steadily']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Bicycle Crunches',
                duration: 50,
                type: 'exercise',
                description: 'Hands behind head, alternate bringing elbow to opposite knee in pedaling motion.',
                videoUrl: 'https://www.youtube.com/watch?v=9FGilxCbdz8',
                targetMuscles: ['Obliques', 'Abs'],
                tips: ['Twist from ribcage', 'Dont pull neck']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Side Plank (Right)',
                duration: 35,
                type: 'exercise',
                description: 'Stack feet or stagger them. Lift hips to create straight line from head to feet. Hold.',
                videoUrl: 'https://www.youtube.com/watch?v=K2VljzCC16g',
                targetMuscles: ['Obliques', 'Core'],
                tips: ['Keep hips lifted', 'Modify on knee if needed']
            },
            { name: 'Rest', duration: 10, type: 'rest' },
            {
                name: 'Side Plank (Left)',
                duration: 35,
                type: 'exercise',
                description: 'Same as right side. Maintain straight line and squeeze obliques.',
                videoUrl: 'https://www.youtube.com/watch?v=K2VljzCC16g',
                targetMuscles: ['Obliques', 'Core'],
                tips: ['Dont let hips drop', 'Keep shoulder over elbow']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Leg Raises',
                duration: 45,
                type: 'exercise',
                description: 'Lie on back, hands under hips. Lift straight legs to 90 degrees, then lower slowly without touching floor.',
                videoUrl: 'https://www.youtube.com/watch?v=JB2oyawG9KI',
                targetMuscles: ['Lower Abs', 'Hip Flexors'],
                tips: ['Press lower back down', 'Bend knees to modify']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Bird Dog',
                duration: 50,
                type: 'exercise',
                description: 'On all fours, extend opposite arm and leg simultaneously. Hold briefly, then switch sides.',
                videoUrl: 'https://www.youtube.com/watch?v=wiFNA3sqjCA',
                targetMuscles: ['Core', 'Back', 'Balance'],
                tips: ['Keep hips level', 'Move with control']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Hollow Body Hold',
                duration: 40,
                type: 'exercise',
                description: 'Lie on back. Lift shoulders and legs off ground, arms by ears, creating a banana shape. Hold.',
                videoUrl: 'https://www.youtube.com/watch?v=nqiYX1wL4Gs',
                targetMuscles: ['Core', 'Hip Flexors'],
                tips: ['Press lower back into floor', 'Tuck chin slightly']
            },
            { name: 'Rest', duration: 15, type: 'rest' },
            {
                name: 'Mountain Climbers',
                duration: 45,
                type: 'exercise',
                description: 'From plank, rapidly alternate driving knees toward chest.',
                videoUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
                targetMuscles: ['Core', 'Cardio'],
                tips: ['Keep hips low', 'Move quickly']
            },
            { name: 'Cool Down Stretch', duration: 60, type: 'cooldown' }
        ]
    },

    // =====================================================
    // YOGA & STRETCH
    // =====================================================
    {
        id: 5,
        title: 'Morning Yoga Flow',
        instructor: 'Emma Chen',
        category: 'yoga',
        duration: 15,
        intensity: 'Low',
        intensityEmoji: '🧘',
        thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
        equipment: ['Mat'],
        description: 'Wake up your body with this gentle yoga flow. Perfect for increasing flexibility and starting your day mindfully.',
        calories: 80,
        difficulty: 'Beginner',
        exercises: [
            {
                name: 'Cat-Cow Stretch',
                duration: 60,
                type: 'exercise',
                description: 'On all fours, alternate between arching back (cow) and rounding spine (cat) with breath.',
                videoUrl: 'https://www.youtube.com/watch?v=kqnua4rHVVA',
                targetMuscles: ['Spine', 'Core'],
                tips: ['Move with breath', 'Keep movement fluid']
            },
            {
                name: 'Downward Dog',
                duration: 45,
                type: 'exercise',
                description: 'From all fours, lift hips up and back forming an inverted V. Press heels toward floor.',
                videoUrl: 'https://www.youtube.com/watch?v=j97SSGsnCAQ',
                targetMuscles: ['Hamstrings', 'Shoulders', 'Calves'],
                tips: ['Bend knees if hamstrings are tight', 'Press chest toward thighs']
            },
            {
                name: 'Forward Fold',
                duration: 45,
                type: 'exercise',
                description: 'Stand with feet hip-width, fold forward from hips, letting head and arms hang. Slight knee bend OK.',
                videoUrl: 'https://www.youtube.com/watch?v=g7Uhp5tphAs',
                targetMuscles: ['Hamstrings', 'Lower Back'],
                tips: ['Let head be heavy', 'Bend knees as needed']
            },
            {
                name: 'Low Lunge (Right)',
                duration: 45,
                type: 'exercise',
                description: 'Step right foot forward between hands. Lower back knee to floor. Lift torso and raise arms overhead.',
                videoUrl: 'https://www.youtube.com/watch?v=UoLo4w3aCZs',
                targetMuscles: ['Hip Flexors', 'Quads'],
                tips: ['Sink hips forward', 'Keep front knee over ankle']
            },
            {
                name: 'Low Lunge (Left)',
                duration: 45,
                type: 'exercise',
                description: 'Same position on left side. Focus on opening hip flexors.',
                videoUrl: 'https://www.youtube.com/watch?v=UoLo4w3aCZs',
                targetMuscles: ['Hip Flexors', 'Quads'],
                tips: ['Breathe into the stretch', 'Relax shoulders']
            },
            {
                name: 'Warrior II (Right)',
                duration: 40,
                type: 'exercise',
                description: 'Wide stance, right foot forward. Bend right knee, extend arms to sides. Gaze over right hand.',
                videoUrl: 'https://www.youtube.com/watch?v=Mn6RSIRCV3w',
                targetMuscles: ['Legs', 'Core', 'Shoulders'],
                tips: ['Keep knee over ankle', 'Sink into hips']
            },
            {
                name: 'Warrior II (Left)',
                duration: 40,
                type: 'exercise',
                description: 'Same position on left side. Strong legs, long spine.',
                videoUrl: 'https://www.youtube.com/watch?v=Mn6RSIRCV3w',
                targetMuscles: ['Legs', 'Core', 'Shoulders'],
                tips: ['Arms parallel to floor', 'Engage core']
            },
            {
                name: 'Triangle Pose (Right)',
                duration: 40,
                type: 'exercise',
                description: 'From Warrior II, straighten front leg. Reach forward and tilt down, placing hand on shin or floor. Top arm up.',
                videoUrl: 'https://www.youtube.com/watch?v=S6gB0QHbWFE',
                targetMuscles: ['Hamstrings', 'Obliques', 'Spine'],
                tips: ['Reach through crown of head', 'Stack shoulders']
            },
            {
                name: 'Triangle Pose (Left)',
                duration: 40,
                type: 'exercise',
                description: 'Same position on left side. Open chest toward ceiling.',
                videoUrl: 'https://www.youtube.com/watch?v=S6gB0QHbWFE',
                targetMuscles: ['Hamstrings', 'Obliques', 'Spine'],
                tips: ['Dont collapse into front leg', 'Lengthen both sides']
            },
            {
                name: 'Seated Forward Fold',
                duration: 50,
                type: 'exercise',
                description: 'Sit with legs extended. Fold forward from hips, reaching for feet or shins. Let head relax.',
                videoUrl: 'https://www.youtube.com/watch?v=t1Z5gWsHC5E',
                targetMuscles: ['Hamstrings', 'Lower Back'],
                tips: ['Lead with chest', 'Breathe into stretch']
            },
            {
                name: 'Supine Twist (Both Sides)',
                duration: 60,
                type: 'exercise',
                description: 'Lie on back, hug one knee and let it fall across body. Arms out, look opposite direction. Switch sides.',
                videoUrl: 'https://www.youtube.com/watch?v=dTv2xMiIMzM',
                targetMuscles: ['Spine', 'Hip', 'Chest'],
                tips: ['Keep both shoulders down', 'Breathe deeply']
            },
            {
                name: 'Childs Pose',
                duration: 60,
                type: 'exercise',
                description: 'Kneel and sit back on heels, fold forward with arms extended or by sides. Relax completely.',
                videoUrl: 'https://www.youtube.com/watch?v=2MJGg-dUKh0',
                targetMuscles: ['Back', 'Hips', 'Shoulders'],
                tips: ['Widen knees if needed', 'Rest forehead on mat']
            },
            {
                name: 'Savasana',
                duration: 60,
                type: 'cooldown',
                description: 'Lie flat on back, arms by sides, palms up. Close eyes and relax every muscle.',
                videoUrl: 'https://www.youtube.com/watch?v=1VYlOKUdylM',
                targetMuscles: ['Full Body Relaxation'],
                tips: ['Let go of all tension', 'Focus on breath']
            }
        ]
    },
    {
        id: 6,
        title: 'Flexibility & Mobility',
        instructor: 'Emma Chen',
        category: 'yoga',
        duration: 15,
        intensity: 'Low',
        intensityEmoji: '🧘',
        thumbnail: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=400&h=300&fit=crop',
        equipment: ['Mat'],
        description: 'Improve your range of motion and reduce muscle tension. Great for recovery days or after intense workouts.',
        calories: 70,
        difficulty: 'All Levels',
        exercises: [
            {
                name: 'Neck Rolls',
                duration: 45,
                type: 'exercise',
                description: 'Gently roll head in circles, releasing neck tension. Switch directions halfway.',
                videoUrl: 'https://www.youtube.com/watch?v=wQylqaCl8Zo',
                targetMuscles: ['Neck', 'Upper Trap'],
                tips: ['Move slowly', 'Avoid rolling head back fully']
            },
            {
                name: 'Shoulder Circles',
                duration: 40,
                type: 'exercise',
                description: 'Roll shoulders forward, up, back, and down in large circles. Switch directions.',
                videoUrl: 'https://www.youtube.com/watch?v=hI4V2EYiB6c',
                targetMuscles: ['Shoulders', 'Upper Back'],
                tips: ['Make big circles', 'Keep core engaged']
            },
            {
                name: 'Standing Side Stretch',
                duration: 50,
                type: 'exercise',
                description: 'Reach right arm overhead and lean left. Hold, then switch sides.',
                videoUrl: 'https://www.youtube.com/watch?v=d4tJSroQbkk',
                targetMuscles: ['Obliques', 'Lats'],
                tips: ['Keep hips square', 'Breathe into side body']
            },
            {
                name: '90/90 Hip Stretch',
                duration: 60,
                type: 'exercise',
                description: 'Sit with one leg in front at 90 degrees, one behind at 90 degrees. Lean forward over front leg.',
                videoUrl: 'https://www.youtube.com/watch?v=IfYM7VhUOjk',
                targetMuscles: ['Hip Rotators', 'Glutes'],
                tips: ['Keep spine tall', 'Switch sides halfway']
            },
            {
                name: 'Pigeon Pose (Right)',
                duration: 50,
                type: 'exercise',
                description: 'From downward dog, bring right knee behind right wrist. Extend left leg back. Fold forward.',
                videoUrl: 'https://www.youtube.com/watch?v=ixr_lD8jsk4',
                targetMuscles: ['Hip Flexors', 'Glutes', 'Piriformis'],
                tips: ['Use a block under hip if needed', 'Square hips']
            },
            {
                name: 'Pigeon Pose (Left)',
                duration: 50,
                type: 'exercise',
                description: 'Same position on left side. Deep hip opener.',
                videoUrl: 'https://www.youtube.com/watch?v=ixr_lD8jsk4',
                targetMuscles: ['Hip Flexors', 'Glutes', 'Piriformis'],
                tips: ['Breathe through intensity', 'Dont force it']
            },
            {
                name: 'Frog Stretch',
                duration: 50,
                type: 'exercise',
                description: 'On all fours, widen knees as far as comfortable. Keep ankles in line with knees. Sink hips back.',
                videoUrl: 'https://www.youtube.com/watch?v=s-bAcLGG8TU',
                targetMuscles: ['Inner Thighs', 'Hips'],
                tips: ['Go only as deep as comfortable', 'Pad knees if needed']
            },
            {
                name: 'Lying Quad Stretch',
                duration: 50,
                type: 'exercise',
                description: 'Lie on side. Grab top ankle and pull heel toward glute. Feel stretch in front of thigh.',
                videoUrl: 'https://www.youtube.com/watch?v=h0m5AqLNs6c',
                targetMuscles: ['Quads', 'Hip Flexors'],
                tips: ['Keep knees together', 'Switch sides']
            },
            {
                name: 'Figure Four Stretch',
                duration: 50,
                type: 'exercise',
                description: 'Lie on back. Cross right ankle over left knee. Pull left thigh toward chest.',
                videoUrl: 'https://www.youtube.com/watch?v=JbhWIv47XBg',
                targetMuscles: ['Glutes', 'Piriformis'],
                tips: ['Keep head down', 'Flex crossed foot']
            },
            {
                name: 'Happy Baby',
                duration: 50,
                type: 'exercise',
                description: 'Lie on back. Grab outside of feet, pull knees toward armpits. Gently rock side to side.',
                videoUrl: 'https://www.youtube.com/watch?v=E1p2DaR2IhY',
                targetMuscles: ['Hips', 'Lower Back', 'Inner Thighs'],
                tips: ['Keep tailbone down', 'Relax shoulders']
            },
            {
                name: 'Savasana',
                duration: 60,
                type: 'cooldown',
                description: 'Final relaxation. Let body absorb the benefits of the practice.',
                videoUrl: 'https://www.youtube.com/watch?v=1VYlOKUdylM',
                targetMuscles: ['Full Body'],
                tips: ['Close eyes', 'Let go completely']
            }
        ]
    },

    // =====================================================
    // BEGINNER WORKOUTS
    // =====================================================
    {
        id: 7,
        title: 'Beginner Bodyweight',
        instructor: 'Lisa Park',
        category: 'beginner',
        duration: 15,
        intensity: 'Low',
        intensityEmoji: '⭐',
        thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
        equipment: ['None'],
        description: 'Perfect introduction to exercise. Low-impact movements with longer rest periods. Build fitness foundation safely.',
        calories: 100,
        difficulty: 'Beginner',
        exercises: [
            {
                name: 'Marching in Place',
                duration: 45,
                type: 'exercise',
                description: 'March in place, lifting knees to hip height. Swing arms naturally. Start warming up the body.',
                videoUrl: 'https://www.youtube.com/watch?v=3tz8SCvA7SM',
                targetMuscles: ['Legs', 'Core', 'Cardio'],
                tips: ['Stay tall', 'Keep breathing steady']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Wall Push-Ups',
                duration: 45,
                type: 'exercise',
                description: 'Stand arm\'s length from wall. Place hands on wall at shoulder height. Bend elbows to bring chest toward wall, then push back.',
                videoUrl: 'https://www.youtube.com/watch?v=a6YHbXD2XlU',
                targetMuscles: ['Chest', 'Triceps', 'Shoulders'],
                tips: ['Keep body straight', 'Control the movement']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Chair Squats',
                duration: 45,
                type: 'exercise',
                description: 'Stand in front of chair. Lower down until you touch the seat, then stand back up. Chair provides safety.',
                videoUrl: 'https://www.youtube.com/watch?v=YS7mEd0GlNM',
                targetMuscles: ['Quads', 'Glutes'],
                tips: ['Keep weight in heels', 'Chest up']
            },
            { name: 'Rest', duration: 25, type: 'rest' },
            {
                name: 'Standing Side Leg Raises',
                duration: 45,
                type: 'exercise',
                description: 'Hold wall for balance. Lift leg out to side, keeping it straight. Lower with control. Switch sides.',
                videoUrl: 'https://www.youtube.com/watch?v=wDVg0HZJfDY',
                targetMuscles: ['Hip Abductors', 'Glutes'],
                tips: ['Keep hips facing forward', 'Dont lean to side']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Modified Plank (Knees)',
                duration: 35,
                type: 'exercise',
                description: 'Forearm plank with knees on the ground. Keep straight line from head to knees.',
                videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
                targetMuscles: ['Core', 'Shoulders'],
                tips: ['Dont let hips sag', 'Breathe steadily']
            },
            { name: 'Rest', duration: 25, type: 'rest' },
            {
                name: 'Standing Calf Raises',
                duration: 40,
                type: 'exercise',
                description: 'Stand near wall for balance. Rise up onto balls of feet, squeezing calves. Lower slowly.',
                videoUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
                targetMuscles: ['Calves'],
                tips: ['Full range of motion', 'Control the descent']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Seated Knee Extensions',
                duration: 45,
                type: 'exercise',
                description: 'Sit in chair. Extend one leg straight out, squeezing quad. Hold briefly, then lower. Alternate legs.',
                videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0',
                targetMuscles: ['Quads'],
                tips: ['Squeeze at top', 'Control movement']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Standing Hip Circles',
                duration: 40,
                type: 'exercise',
                description: 'Stand on one leg (hold wall if needed). Make circles with raised leg. Switch directions and legs.',
                videoUrl: 'https://www.youtube.com/watch?v=O_Xj2kRRzE8',
                targetMuscles: ['Hips', 'Balance'],
                tips: ['Keep core engaged', 'Make smooth circles']
            },
            { name: 'Rest', duration: 20, type: 'rest' },
            {
                name: 'Arm Circles',
                duration: 40,
                type: 'exercise',
                description: 'Extend arms to sides. Make small circles, gradually making them larger. Reverse direction.',
                videoUrl: 'https://www.youtube.com/watch?v=140RTNMciH8',
                targetMuscles: ['Shoulders', 'Arms'],
                tips: ['Keep arms straight', 'Engage core']
            },
            { name: 'Cool Down Stretch', duration: 60, type: 'cooldown' }
        ]
    },
    {
        id: 8,
        title: 'Gentle Morning Wake-Up',
        instructor: 'Lisa Park',
        category: 'beginner',
        duration: 15,
        intensity: 'Low',
        intensityEmoji: '☀️',
        thumbnail: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&h=300&fit=crop',
        equipment: ['Mat'],
        description: 'Start your day gently with this easy routine that wakes up your body without overwhelming it. Perfect for beginners.',
        calories: 60,
        difficulty: 'Beginner',
        exercises: [
            {
                name: 'Deep Breathing',
                duration: 45,
                type: 'exercise',
                description: 'Stand or sit comfortably. Inhale deeply through nose for 4 counts, hold for 4, exhale through mouth for 6.',
                videoUrl: 'https://www.youtube.com/watch?v=acUZdGd_3Gw',
                targetMuscles: ['Diaphragm', 'Relaxation'],
                tips: ['Breathe into belly', 'Relax shoulders']
            },
            {
                name: 'Gentle Neck Stretches',
                duration: 50,
                type: 'exercise',
                description: 'Slowly tilt head to each side, forward and back. Hold each position for a few breaths.',
                videoUrl: 'https://www.youtube.com/watch?v=wQylqaCl8Zo',
                targetMuscles: ['Neck', 'Upper Traps'],
                tips: ['Move slowly', 'Never force']
            },
            {
                name: 'Shoulder Shrugs',
                duration: 40,
                type: 'exercise',
                description: 'Raise shoulders toward ears, hold briefly, then release down with a sigh.',
                videoUrl: 'https://www.youtube.com/watch?v=1xJhJBnHPfI',
                targetMuscles: ['Upper Traps', 'Shoulders'],
                tips: ['Release tension as you drop', 'Repeat slowly']
            },
            {
                name: 'Standing Cat-Cow',
                duration: 50,
                type: 'exercise',
                description: 'Hands on thighs. Round spine like a cat, then arch and lift chest like a cow. Flow with breath.',
                videoUrl: 'https://www.youtube.com/watch?v=BwQFcLY8Hw8',
                targetMuscles: ['Spine', 'Core'],
                tips: ['Move with breath', 'Feel each vertebra']
            },
            {
                name: 'Gentle Torso Twists',
                duration: 45,
                type: 'exercise',
                description: 'Stand with feet hip-width. Gently twist torso side to side, letting arms swing naturally.',
                videoUrl: 'https://www.youtube.com/watch?v=yXMUqFV-AKk',
                targetMuscles: ['Spine', 'Obliques'],
                tips: ['Keep hips facing forward', 'Relax arms']
            },
            {
                name: 'Hip Circles',
                duration: 45,
                type: 'exercise',
                description: 'Hands on hips. Make large circles with hips, like using a hula hoop. Switch directions.',
                videoUrl: 'https://www.youtube.com/watch?v=LPMkw6H1f7E',
                targetMuscles: ['Hips', 'Lower Back'],
                tips: ['Make full circles', 'Keep knees soft']
            },
            {
                name: 'Ankle Circles',
                duration: 40,
                type: 'exercise',
                description: 'Lift one foot slightly. Rotate ankle in circles. Switch directions and feet.',
                videoUrl: 'https://www.youtube.com/watch?v=8k7s3cZREyU',
                targetMuscles: ['Ankles', 'Calves'],
                tips: ['Full range of motion', 'Hold wall for balance']
            },
            {
                name: 'Toe Touches',
                duration: 45,
                type: 'exercise',
                description: 'Stand tall. Slowly roll down reaching for toes (or as far as comfortable). Roll back up.',
                videoUrl: 'https://www.youtube.com/watch?v=g7Uhp5tphAs',
                targetMuscles: ['Hamstrings', 'Spine'],
                tips: ['Roll slowly', 'Bend knees if needed']
            },
            {
                name: 'Gentle Squats',
                duration: 45,
                type: 'exercise',
                description: 'Feet shoulder-width. Lower partway down, just a few inches, then stand. Easy on joints.',
                videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
                targetMuscles: ['Quads', 'Glutes'],
                tips: ['Only go as low as comfortable', 'Keep chest up']
            },
            {
                name: 'Arm Swings',
                duration: 40,
                type: 'exercise',
                description: 'Let arms swing freely forward and back, then across body. Loosen shoulder joints.',
                videoUrl: 'https://www.youtube.com/watch?v=QeOiYd4Bck4',
                targetMuscles: ['Shoulders', 'Arms'],
                tips: ['Stay relaxed', 'Let momentum help']
            },
            {
                name: 'Standing Side Stretch',
                duration: 50,
                type: 'exercise',
                description: 'Reach one arm overhead and lean to opposite side. Hold and breathe. Switch sides.',
                videoUrl: 'https://www.youtube.com/watch?v=d4tJSroQbkk',
                targetMuscles: ['Obliques', 'Lats'],
                tips: ['Keep both feet grounded', 'Breathe into stretch']
            },
            {
                name: 'Final Deep Breaths',
                duration: 60,
                type: 'cooldown',
                description: 'Stand tall. Take 5 deep breaths, feeling energized and ready for your day.',
                videoUrl: 'https://www.youtube.com/watch?v=acUZdGd_3Gw',
                targetMuscles: ['Full Body', 'Mind'],
                tips: ['Set an intention', 'Smile!']
            }
        ]
    }
];

// Workout categories for filtering
export const workoutCategories = [
    { id: 'hiit', name: 'HIIT', icon: '🔥', description: 'High intensity interval training' },
    { id: 'strength', name: 'Strength', icon: '💪', description: 'Build muscle and power' },
    { id: 'yoga', name: 'Yoga', icon: '🧘', description: 'Flexibility and mindfulness' },
    { id: 'beginner', name: 'Beginner', icon: '⭐', description: 'Perfect for starting out' }
];

