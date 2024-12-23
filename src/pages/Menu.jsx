import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

function Menu() {
  return (
    <>
      <Navbar />
      <h1 className="text-center text-4xl text-red-500">In sviluppo</h1>
      <table>
        <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
        </tr>
        <tr>
            <td>4</td>
            <td>5</td>
            <td>6</td>
        </tr>
        <tr>
            <td>7</td>
            <td>8</td>
            <td>9</td>
        </tr>
        <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
        </tr>
        <tr>
            <td>4</td>
            <td>5</td>
            <td>6</td>
        </tr>
        <tr>
            <td>7</td>
            <td>8</td>
            <td>9</td>
        </tr>
        <tr>
            <td>1</td>
            <td>2</td>
            <td>3</td>
        </tr>
      </table>
      <Footer />
    </>
  );
}

export default Menu;
