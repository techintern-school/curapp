import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ProjectContent from './ProjectContent'
import projects from '../../curic/seProjects.json'
import GithubIssue from '../../components/GithubIssue'
import Button from '@material-ui/core/Button';
import { setActiveProject, markProjectCompleted } from '../../redux/actions.js';
import { updateUserData, handleLoginFromRefresh, setActiveProjectFromDB } from '../../utils/backend.js'
import { setUser } from '../../redux/actions.js';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
}));


function Learn(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleProjectClick = (index) => {
        props.setActiveProject(index);
        updateUserData({activeProject: index})
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    function getProject(index) {
        if (typeof projects[index] === "object") {
            return projects[index];
        } else {
            console.log(`unknown project ${index}`)
            return {
                "content": [],
                "version": "0.0.1",
                "name": "Unknown project"
            }
        }
        
    }
    useEffect(() => {
        handleLoginFromRefresh(props.setUser, props.setActiveProject);
    }, [])
    
    function NextProject(){
        return(
            <Button variant="contained" color="primary" onClick={handleProjectClick.bind(null, props.activeProject + 1)}>NEXT PROJECT</Button>
        )
    }


    

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        techIntern.school - Online Learning Portal
                    </Typography>
                    <GithubIssue/>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {projects.map((projectInfo, index) => (
                        <ListItem onClick={handleProjectClick.bind(null, index)} button key={projectInfo.name}>
                            <ListItemText primary={`${index}. ${projectInfo.name}`} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            {props.user.uid ? (
                <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader} />
                <ProjectContent project={getProject(props.activeProject)} />
                <NextProject/>
            </main>
            ) : <div><br/><br/><br/><br/>TODO: Need to login</div>}
            
        </div>
    );
}

const mapDispatchToProps = dispatch => {
    return { 
        setActiveProject: (id) => { dispatch(setActiveProject(id)) }, 
        onProjectComplte: (id) => { dispatch(markProjectCompleted(id)) }, 
        setUser: (user) => { 
            dispatch(setUser(user)) 
        }
    }
};
const mapStateToProps = state => {
    const { learning: {activeProject, completedProjects}, user } = state;
    return {
        activeProject, completedProjects, user
    }
}
const ConnectedLearn = connect(mapStateToProps, mapDispatchToProps)(Learn)

export default ConnectedLearn;