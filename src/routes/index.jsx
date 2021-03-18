import React from 'react';
import { BrowserRouter as Router , Route, Switch } from 'react-router-dom';
import StudentPage from '../pages/StudentPage';
import TeacherPage from '../pages/TeacherPage';
import AddTeacher from '../pages/TeacherPage/AddTeacher';
import { path } from './../constants/paths';
import HomePage from './../pages/Homepage';

function Routes() {
    return (
        <Router>
            <Switch>
                <Route  path = {path.STUDENT} component = {StudentPage} />
                <Route path = {path.TEACHER_MANAGER_ADD} component = {AddTeacher} />
                <Route path = {path.TEACHER_MANAGER} component = {TeacherPage} />
                <Route exact = {true} path = {path.HOME} component = {HomePage} />
            </Switch>
        </Router>
    );
}

export default Routes;