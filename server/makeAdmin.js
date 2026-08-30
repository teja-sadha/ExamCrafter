const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const makeAdmin = async () => {
    try {
        await connectDB();

        const email = "admin@codearena.com";

        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found");
            process.exit(1);
        }

        user.role = "admin";

        await user.save();

        console.log("Admin role assigned successfully");
        console.log(`Admin: ${user.email}`);

        process.exit(0);

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

makeAdmin();