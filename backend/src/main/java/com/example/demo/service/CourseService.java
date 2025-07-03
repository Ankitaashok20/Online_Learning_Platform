package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Course;
import com.example.demo.entity.Feedback;
import com.example.demo.entity.Questions;
import com.example.demo.repository.CourseRepository;

import jakarta.transaction.Transactional;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course updatedCourse) {
        Course existingCourse = courseRepository.findById(id).orElse(null);
        if (existingCourse != null) {
            existingCourse.setCourseName(updatedCourse.getCourseName());
            existingCourse.setDescription(updatedCourse.getDescription());
            existingCourse.setPhoto(updatedCourse.getPhoto());
            existingCourse.setPrice(updatedCourse.getPrice());
            existingCourse.setTutor(updatedCourse.getTutor());
            existingCourse.setVideo(updatedCourse.getVideo());
            return courseRepository.save(existingCourse);
        }
        return null;
    }

    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id).orElse(null);
        if (course != null) {
            System.out.println("Deleting course: " + id);
            System.out
                    .println("Feedbacks count: " + (course.getFeedbacks() == null ? 0 : course.getFeedbacks().size()));
            System.out
                    .println("Questions count: " + (course.getQuestions() == null ? 0 : course.getQuestions().size()));

            if (course.getFeedbacks() != null) {
                for (Feedback feedback : course.getFeedbacks()) {
                    feedback.setCourse(null); // Break FK from Feedback
                }
                course.getFeedbacks().clear();
            }

            if (course.getQuestions() != null) {
                for (Questions question : course.getQuestions()) {
                    question.setCourse(null); // Break FK from Questions
                }
                course.getQuestions().clear();
            }

            courseRepository.save(course); // Persist disassociation
            courseRepository.delete(course); // Now safe to delete
        } else {
            System.out.println("Course not found");
        }
    }
}
