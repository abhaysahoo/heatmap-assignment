"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const HeatmapPage = () => {
    const [userList, setUserList] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const properties = useRef([]);

    //initially loading the user list
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://forinterview.onrender.com/people');
                const data = await response.json();
                setUserList(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchUsers();
    }, [])

    const handleClick = async (user) => {
        //if the user already exists in the selectedUsers we remove the user
        if (selectedUsers.filter(u => u.id === user.id).length) {
            setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
            //otherwise we fetch the data for that user and store the new use along with other selected Users in the state variable
        } else {
            try {
                const response = await fetch(`https://forinterview.onrender.com/people/${user.id}`);
                const data = await response.json();

                const newUser = {};

                newUser["id"] = user.id;
                newUser["name"] = user.name;

                const skillObject = {}
                data.data.data.skillset.forEach(skillsetItem => {
                    skillsetItem.skills.forEach(skill => {
                        skillObject[skill.name] = skill.pos[0].consensus_score
                    })
                });

                newUser["skills"] = skillObject;
                setSelectedUsers(prevUsers => ([...prevUsers, newUser]));

                if (properties.current.length === 0) {
                    properties.current = Object.keys(newUser.skills);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    const getColor = (value) => {
        switch (value) {
            case 0: return "bg-white";
            case 1: return "bg-yellow-100";
            case 2: return "bg-lime-200";
            case 3: return "bg-green-600";
            case 4: return "bg-green-900";
            default: return "bg-white";
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left side: List of names */}
            <div className="border-2 border-black flex flex-col w-[300px]">
                <div className="p-4 text-center font-semibold border-b-2 border-black">Most recommended</div>
                <div className="px-4 bg-gray-100 border-b-2 border-black">
                    <ul>
                        {userList && userList.slice(0, 3).map((user) => (
                            <li
                                key={user.id}
                                className={`cursor-pointer px-4 py-1 flex items-center gap-4 border-b-2`}
                                onClick={() => handleClick(user)}
                            >
                                <Image
                                    src="/images/user.png"
                                    alt="user image"
                                    width={30}
                                    height={30}
                                />
                                <div className={`font-bold text-xs py-2 hover:underline ${selectedUsers.filter(u => u.id === user.id).length ? "font-bold text-lime-600" : "text-gray-800"}`}
                                >
                                    {user.name}
                                </div>
                                <Image
                                    src="/icons/plus-circle.svg"
                                    alt="plus circle icon"
                                    width={24}
                                    height={24}
                                    className="ml-auto"
                                />
                            </li>
                        ))}
                    </ul>
                    <div className="text-xs text-gray-500 py-4">
                        Recommendations are based on your skill requirements and candidate's performance
                    </div>
                </div>
                <div className="w-full h-[50px]"></div>
                <div className="bg-gray-100 border-t-2 border-black px-4">
                    <ul>
                        {userList && userList.slice(3).map((user) => (
                            <li
                                key={user.id}
                                className={`cursor-pointer px-4 py-1 flex items-center gap-4 border-b-2`}
                                onClick={() => handleClick(user)}
                            >
                                <Image
                                    src="/images/user.png"
                                    alt="user image"
                                    width={30}
                                    height={30}
                                />
                                <div
                                    className={`font-bold text-xs py-2 hover:underline ${selectedUsers.filter(u => u.id === user.id).length ? "font-bold text-lime-600" : "text-gray-800"}`}
                                >
                                    {user.name}
                                </div>
                                <Image
                                    src="/icons/plus-circle.svg"
                                    alt="plus circle icon"
                                    width={24}
                                    height={24}
                                    className="ml-auto"
                                />
                            </li>
                        ))}
                    </ul>
                </div>

            </div>

            {/* Right side: Heatmap */}
            <div className="p-4 w-full">
                {selectedUsers.length > 0 ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Heatmap for Selected Users</h2>
                        <div className="overflow-x-auto">
                            <table className="table-fixed w-full border-separate border-spacing-2">
                                <thead>
                                    <tr>
                                        <th className="max-w-[200px]"></th> {/* Empty corner cell */}
                                        {selectedUsers.map((user, index) => (
                                            <th key={index} className="w-[40px] overflow-hidden px-2 py-1 text-left">{user.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.current.map((property, propertyIndex) => (
                                        <tr key={propertyIndex}>
                                            <td className="font-semibold max-w-[200px] pr-2 py-1">{property}</td>
                                            {selectedUsers.map((user, userIndex) =>
                                            (
                                                <td
                                                    key={userIndex}
                                                    className={`w-[40px] h-[30px] px-2 py-2 border ${getColor(user.skills[property])}`}
                                                >
                                                </td>
                                            )
                                            )}
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
