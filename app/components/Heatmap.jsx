"use client";

import { useState } from "react";
import { skillObjects } from "@/constants";

const HeatmapPage = () => {
    const userList = ['Anna', 'Lynn', 'Joseph', 'Andrew', 'Katie', 'Bhavesh', 'Sumit', 'Rajesh', 'Adrian', 'Michael', 'Kabir', 'Yakamura', 'Sai', 'Rajendar', 'Sally'];

    const userHeatmapData = {};

    for (let i = 0; i < userList.length; i++) {
        const user = userList[i];
        const skillIndex = Math.floor(i / 3) % skillObjects.length;
        userHeatmapData[user] = skillObjects[skillIndex];
    }

    const [selectedUsers, setSelectedUsers] = useState([]);

    const properties = Object.keys(skillObjects[0]);

    const toggleUserSelection = (user) => {
        if (selectedUsers.includes(user)) {
            setSelectedUsers(selectedUsers.filter((u) => u !== user)); 
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const getColor = (value) => {
        switch (value) {
            case 0: return "bg-lime-100";
            case 1: return "bg-lime-300";
            case 2: return "bg-lime-500";
            case 3: return "bg-lime-700";
            case 4: return "bg-lime-900";
            default: return "bg-lime-100";
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side: List of names */}
            <div className="w-1/7 p-4 bg-gray-100">
                <ul>
                    {userList.map((user, index) => (
                        <li
                            key={index}
                            className={`cursor-pointer py-2 hover:underline ${selectedUsers.includes(user) ? "font-bold text-lime-600" : "text-gray-800"}`}
                            onClick={() => toggleUserSelection(user)}
                        >
                            {user}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right side: Heatmap */}
            <div className=" p-4">
                {selectedUsers.length > 0 ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Heatmap for Selected Users</h2>
                        <div className="overflow-x-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left min-w-[400px]"></th> {/* Empty corner cell */}
                                        {selectedUsers.map((user, index) => (
                                            <th key={index} className="max-w-[200px] overflow-hidden text-ellipsis px-2 py-1 border-b text-left">{user}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map((property, propertyIndex) => (
                                        <tr key={propertyIndex}>
                                            <td className="whitespace-normal break-words min-w-[200px] pr-2 py-1 text-left border-r">{property}</td>
                                            {selectedUsers.map((user, userIndex) => (
                                                <td
                                                    key={userIndex}
                                                    className={`px-4 py-2 text-center border ${getColor(userHeatmapData[user][property])}`}
                                                >
                                                    {userHeatmapData[user][property]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">Please select one or more users to view their heatmap</p>
                )}
            </div>
        </div>
    );
};

export default HeatmapPage;
